'use strict'

const ctrl = complexAppControllers();
//module.exports = complexAppControllers;

const load = require('express-load');
load("models", {cwd: 'webserver/app', verbose:true})
  .into(ctrl);

//const db = require('./db');
const mqtt = require('mqtt')
const asyncObj = require('async');
const mongoose = require('mongoose');
var serverSettings = require('./app/config/complex.config');


var connect = function(){
   mongoose.connect(serverSettings.db.url,serverSettings.db.options);
};
connect();
mongoose.connection.on('error',console.log);
mongoose.connection.on('disconnected',connect);
console.log('Mongo db connected');

var ActionModel = mongoose.model('Action');
var KnowledgeModel = mongoose.model('Knowledge');
var ObjectId = require('mongodb').ObjectID;

const getBoardDecorateIO = require('./app/decorators/equipments');
let boardDecorator = getBoardDecorateIO();

const getTopicDecorateIO = require('./app/decorators/topic');
let topicDecorator = getTopicDecorateIO();

let qGetDynamicTopics = asyncObj.queue(getDynamicTopic, serverSettings.queues.max);
let qGetStaticTopics = asyncObj.queue(getStaticTopic, serverSettings.queues.max);

let qProcessDynamicTopics = asyncObj.queue(processDynamicTopic, serverSettings.queues.max);
let qProcessStaticTopics = asyncObj.queue(processStaticTopic, serverSettings.queues.max);

let qPublishTopics = asyncObj.queue(publishMessage, serverSettings.queues.max);

qGetDynamicTopics.drain = getDynamicTopicsDrain;
qGetStaticTopics.drain = getStaticTopicsDrain;
qProcessDynamicTopics.drain = processDynamicTopicsDrain;
qProcessStaticTopics.drain = processStaticTopicsDrain;
qPublishTopics.drain = publishTopicsDrain;


var mqttClient  = mqtt.connect(serverSettings.mqtt.url.insecure, serverSettings.mqtt.options);
var mqttStore  = null;
var reconnecting = false;

mqttClient.on('connect', function (connack) {
    //client.subscribe('presence')
    if (reconnecting) console.log("mqtt reconnected");
    else console.log("mqtt connected");

    //console.log("connack: ", connack);
})

mqttClient.on('offline', function () {
    console.log("mqtt disconnected");
    mqttStore  = mqtt.Store();
})

mqttClient.on('reconnect', function () {
  reconnecting = true;
  console.log("mqtt reconnecting");
})

mqttClient.on('error', function (error) {
  console.log("mqtt error: ",error);
})

mqttClient.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  client.end()
})

var lastTryClass = {
  clear: () => {
    var value = lastTryClass;
    value.processing = true;
    value.result = {};
    value.start = Date.now();
    value.end = 0;
    return value;
  },
  set: (obj, processing, result) => {
    obj.processing = processing;
    if (result) obj.result = result;
    obj.end = Date.now();
    //obj.show(obj);
  },
  show: (obj) => {
    console.log('processing: ', obj.processing);
    console.log('result: ', obj.result);
    console.log('start: ', obj.start);
    console.log('end: ', obj.end);
  },
  isProcessing: () => {return this.processing}
};
var lastTry = lastTryClass.clear();

ctrl.processAllTopics(showResults);

setInterval(function() {
  if (!lastTry.isProcessing()) {
    lastTry = lastTry.clear();
    ctrl.processAllTopics(showResults);
  }
}, serverSettings.loop);

function complexAppControllers() {
  let methods = {};

  methods.processDynamicTopics = (paramsData, callback) => {
    console.log('Dynamic topic started doing the job!');
    var requests = [];
    //console.log(topicKeys);
    qGetDynamicTopics.push(paramsData, function (err, data) {
      if (!err) err = { code: 0, err: "", topics: {}};
      if(data){
        //console.log('Data: ', data);
        for (let item of data){
          var id = requests.push(item);
          //console.log('topic: ', item.messages.length);

          if (!item.messages.length) {
            err.topics[item.topic._id] = {err: 'No messages found', code:400};
            requests.splice(id, 1);
          }else{
            qProcessDynamicTopics.push(item, function (err, data) {
              console.log('id: ', id-1);
              console.log('topic: ', requests[id-1].topic._id);
              requests.splice(id, 1);
              if (!requests.length) return callback(null, data);
            });
            console.log('size: ', qProcessDynamicTopics.length());
          }
        }
        if (!err.code) err.code = 400;
        if (!err.err) err.err = "Topic Errors";
        if (!requests.length) return callback(err, data);
      }else{
        if(err){
          console.log('Ocurred the following error: ', err);
          return callback(err, null);
        }else{
          return callback({err: 'Not-found', code:402}, null);
        }
      }
    });
  }
  methods.processStaticTopics = (paramsData, callback) => {
    console.log('Static topic started doing the job!');
    //let dynamicTopicKeys = paramsData.topicKeys;
    qGetStaticTopics.push(paramsData, function (err, data) {

      if(err){
        console.log('Ocurred the following error: ', err);
        callback(err, null);
      }else{
        if(data){
          console.log('Data: ', data);
          for (let topic of data){
            console.log('topic: ', topic);
          }
        }
        callback(null, data);
      }
    });
  }
  methods.processAllTopics = (next) => {
    KnowledgeModel.find({"type": "topic", "data.enabled": true})
          .then(complexItems => {
            if (complexItems) {
              let paramsData ={
                "topicKeys": [],
              	"coordinates": [
                          -21.9747775,
                          -47.9046373
                      ],
      	        "radius": 3000
              };
              console.log('complexItems: ', complexItems.length);
              for (let complex of complexItems){
                console.log('starting complex topic: ', complex._id);
                console.log('category: ', complex.category);
                if(complex.category === "generic"){
                  paramsData.topicKeys.push({
                  		"topicId" : complex._id
                  	});
                }
                //setTopic(complex._id, "process", complex.relations.subscribedBy, complex.data);
              }
              console.log('params: ', paramsData);
              methods.processDynamicTopics(paramsData, function(err, data){
                //console.log("finaldata", data)
                console.log("Processamento Liberado !!!!")
                return next(err, data);
              })
            }})
          .catch(err => next({err: err, code: 500, messageKeys: ['not-found']},null));
  }

  return methods;
};

function processDynamicTopic(paramData, callback){
  var pubData = {
    msgtopic: [paramData.topic._id,"action"].join("/"),
    msgdata: paramData,
    processing: true
  };

  qPublishTopics.push(pubData, function (err, data) {
    if(data){
      console.log('\n\n#########################################');
      console.log('##### Msg Enviada com sucesso #####');
      console.log('#########################################');
    }
    callback(err, data);
  });
  //callback(null, paramData.topic._id);
}
function processStaticTopic(topic, callback){
  callback(null, topic);
  //TODO executa fila spark
}

function publishMessage(params, callback) {
  console.log('\n\n#########################################');
  console.log('MQTT broker sending message to process Server ..\n');
  console.log(params);

  //console.log("data:   ",params.msgdata);
  console.log("topic:   ",params.msgtopic);

  if (!params.msgdata) return;
  var splitted = params.msgtopic.split('/');
  if (splitted){
    var id = splitted[0];
    var actiontype = splitted[1];
  } else id = params.msgtopic;
  var objectPayload = {
    _id: id,
    type: params.msgdata.topic.type,
    category: params.msgdata.topic.category,
    data: params.msgdata,
    sync: Date.now(),
    access: id
  };

  var messagePayload = JSON.stringify(objectPayload);
  //var bufferPayload = new Buffer(messagePayload, 'utf-8');

  console.log('\n\n#########################################');
  console.log(' broker sending action message ..\n');

  //console.log("pack:   ",packet);
  var msgTopic = (params.processing)?serverSettings.mqtt.processServer:params.msgtopic;
  if (mqttClient.connected)
    mqttClient.publish(msgTopic, messagePayload, serverSettings.mqtt.options, callback);
  else {
    console.log(' broker not connected ..\n');
    if (mqttStore == null) mqttStore = mqtt.Store();
    var newPacket = {
      messageId: Math.random().toString(16).substr(2, 8),
      topic: msgTopic,
      payload: messagePayload,
      qos: serverSettings.mqtt.options.qos
    };
    mqttStore.put(newPacket, function () {
        console.log("message stored...");
    });
    callback({err: "offline", code: 409}, null);
  }
}

/*function setTopic(topicId, type, authorized, data){
  topics[topicId] = {};
  topics[topicId].type = type;
  topics[topicId].authorized = authorized;
  topics[topicId].data = data;
  topics[topicId].processing = false;
  topics[topicId].frequency = data["configurations"]["freq"] || 1000;
  topics[topicId].threshold = data["configurations"]["threshold"] || 1;
  topics[topicId].lastSync = Date.now();
  console.log('type: ', topics[topicId]);
}*/

function startBasicTopic(topicId){
  console.log('starting basic topic: ', topicId);
  Knowledge.findOne({"_id": ObjectId(topicId)}).then(profile => {
    if (profile) {
      console.log('profile: ', profile.relations);
      setTopic(topicId, (profile.data.pull)?"pull":"push" , profile.relations.subscribedBy, profile.data);
      publishMessage([topicId,"action"].join("/"), profile.relations.subscribedBy, "profiles");
    }
  }).catch(err => console.log("err" + err));
}

function getDynamicTopic(paramsData, callback){
  console.log("topics: ",paramsData.topicKeys);
  if (!paramsData.topicKeys) return callback({data: paramsData.topicKeys, code: 422, messageKeys: ['not-found']}, null);
  topicDecorator.generateDynamicComplexRequest(paramsData, callback);
}
function getStaticTopic(topicKeys, callback){
  console.log("topics: ",topicKeys);
  if (!topicKeys) return {data: topicKeys, code: 422, messageKeys: ['not-found'] };

  topicDecorator.generateStaticComplexRequest(topicKeys, function(result){
    console.log("result info: ",result);
    return callback(null, result.code>0);
  })
}
function showResults(err, data){
  if (err) showError(err);
  else console.log('Results: ', data);
  lastTry.set(lastTry ,false, (err)?err:data);
}
function showError(err){
  console.log('Erro: ', err);
}
function getDynamicTopicsDrain() {
  console.log('No more dynamic topics to get.');
}
function getStaticTopicsDrain() {
  console.log('No more static topics to get.');
}
function processDynamicTopicsDrain() {
  console.log('No more dynamic topics to process.');
}
function processStaticTopicsDrain() {
  console.log('No more static topics to process.');
}

function publishTopicsDrain() {
  console.log('No more message to publish.');
}

function auth(req, next){
  console.log("authenticated");
  req.authenticated = true;
  next(null, req);
}
function getById(req, next){
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) next({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
  ActionModel.find({"equipmentID": req.params.id}).then(data => {
    if (!data) {
      next({ data: data, code: 404, messageKeys: ['not-found'] });
    }
    console.log("getById request");
    next(null, data);
  })
  .catch(err => {
    console.log("err" + err);
    next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
  });
};
function getLastUpdates(req, next){
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) next({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
  ActionModel.getLastUpdates(req.params.id, req.params.sync).then(data => {
    if (!data) {
      next({ data: data, code: 404, messageKeys: ['not-found'] });
    }
    console.log("getLastUpdates request");
    next(null, data);
  })
  .catch(err => {
    console.log("err" + err);
    next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
  });
};
function verifyStatus(req, next){
  topicDecorator.verifyTopicStatus(req.knowledgeMessage.topicKeys[0].topicId, function(err, data){
    if (!data.enabled || data.status==="stopped") {
      console.log('Topic ' +  req.knowledgeMessage.topicKeys[0].topicId + ' stopped.');
      next({code: 0, status: data.status, msg: 'Topic ' +  req.knowledgeMessage.topicKeys[0].topicId + ' stopped.'});
    } else if (data.status==="running") {
      console.log('Topic ' +  req.knowledgeMessage.topicKeys[0].topicId + ' is running.');
      next({code: 1, status: data.status, msg: 'Topic ' +  req.knowledgeMessage.topicKeys[0].topicId + ' is running.'});
    } else {
      console.log('Topic ' +  req.knowledgeMessage.topicKeys[0].topicId + ' is starting.');
      next({code: 2, status: "starting", msg: 'Topic ' +  req.knowledgeMessage.topicKeys[0].topicId + ' starting.'});
    }
  });
}
function processDynamic(req, next){
  //console.log("Controol: ",req.knowledgeMessage);
  if (!req.knowledgeMessage.topicKeys) return next({data: req.knowledgeMessage.topicKeys, code: 422, messageKeys: ['not-found'] });
  if (!req.knowledgeMessage.coordinates) return next({data: req.knowledgeMessage.coordinates, code: 422, messageKeys: ['not-found'] });
  if (!req.knowledgeMessage.radius) next({ data: req.knowledgeMessage.radius, code: 422, messageKeys: ['not-found'] });

  setTimeout(function() {
    topicDecorator.processDynamic(
      {topicKeys: req.knowledgeMessage.topicKeys, coords: req.knowledgeMessage.coordinates, radius: req.knowledgeMessage.radius},
      function(data){
        next(null, data);
      });
  }, 5000);
}
function connectEquipments(req, next){
  console.log("Controol: ",req.knowledgeMessage.boardKeys);
  if (!req.knowledgeMessage.boardKeys) return next({data: req.knowledgeMessage.boardKeys, code: 422, messageKeys: ['not-found'] });

  boardDecorator.connectEquipments(req.knowledgeMessage.boardKeys, function(data){
    console.log("update request");
    KnowledgeModel.update({"_id": ObjectId(req.knowledgeMessage.boardKeys[0].boardId)}, {"$set": {"sync": Date.now(), "data.connected": true}})
      .then(data => {
        KnowledgeModel.update({"relations.connectedTo.id": ObjectId(req.knowledgeMessage.boardKeys[0].boardId)}, {"$set": {"sync":  Date.now(), "data.connected": true}})
          .then(data => {
            next(null, data);
          })
          .catch(err => {
            next(err);
          });
      })
      .catch(err => {
        next(err);
      });
  })
}
function disconnectEquipments(req, next){
  console.log("Controol: ",req.knowledgeMessage.boardKeys);
  if (!req.knowledgeMessage.boardKeys) return next({data: req.knowledgeMessage.boardKeys, code: 422, messageKeys: ['not-found'] });

  boardDecorator.disconnectEquipments(req.knowledgeMessage.boardKeys, function(data){
    console.log("update request");
    KnowledgeModel.update({"_id": ObjectId(req.knowledgeMessage.boardKeys[0].boardId)}, {"$set": {"sync":  Date.now(), "data.connected": false}})
      .then(data => {
        KnowledgeModel.update({"relations.connectedTo.id": ObjectId(req.knowledgeMessage.boardKeys[0].boardId)}, {"$set": {"sync":  Date.now(), "data.connected": false}})
          .then(data => {
            next(null, data);
          })
          .catch(err => {
            next(err);
          });
      })
      .catch(err => {
        next(err);
      });
  })
}
function startTopic(req, next){
  console.log("topics: ",req.knowledgeMessage.topicKeys);
  if (!req.knowledgeMessage.topicKeys) return next({data: req.knowledgeMessage.topicKeys, code: 422, messageKeys: ['not-found'] });

  topicDecorator.startTopic(req.knowledgeMessage.topicKeys, function(data){
    next(null, data);
  })
}
function actionRequest(req, next){
  if (!mongoose.Types.ObjectId.isValid(req.knowledgeMessage.equipmentId)) next({ data: req.knowledgeMessage.equipmentID, code: 422, messageKeys: ['not-found'] });
  if (!req.knowledgeMessage.action) next({ data: req.knowledgeMessage.action, code: 422, messageKeys: ['not-found'] });
  if (!req.knowledgeMessage.type) next({ data: req.knowledgeMessage.type, code: 422, messageKeys: ['not-found'] });
  if (!req.knowledgeMessage.data) next({ data: req.knowledgeMessage.data, code: 422, messageKeys: ['not-found'] });
  var actionObject = new Action();
  actionObject.equipmentID = mongoose.Types.ObjectId(req.knowledgeMessage.equipmentId);
  actionObject.action = req.knowledgeMessage.action;
  actionObject.type = req.knowledgeMessage.type;
  actionObject.data = req.knowledgeMessage.data;

  console.log("body: ", actionObject);

  ActionModel.create(actionObject)
    .then(data => {
      console.log("create action start request");
      next(null, data);
    })
    .catch(err => {
      next(err);
    });
};
function sendMessage(req, next){
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next({data: req.params.id, code: 422, messageKeys: ['not-found'] });
  if (!req.knowledgeMessage) return next({data: req.knowledgeMessage, code: 422, messageKeys: ['not-found'] });

  console.log("ActionModel sendMessage request");
  let messageKnowledge = {};

    messageKnowledge.equipmentID = req.params.id;
    messageKnowledge.action = 'message';
    messageKnowledge.type = 'recipe';
    messageKnowledge.data = {
        active: req.knowledgeMessage.active,
        severity: req.knowledgeMessage.severity,
        startDate: req.knowledgeMessage.startDate,
        releaseDate: req.knowledgeMessage.releaseDate,
        configurations: req.knowledgeMessage.configurations,
        channel: req.knowledgeMessage.channel
    };
    //console.log("Nova Mensagem:  " + JSON.stringify(messageKnowledge));
    ActionModel.create(messageKnowledge)
    .then(data => {
      console.log("sendMessage action request");
      next(null, data);
    })
    .catch(err => {
      next(err);
    });
};
function updateMessage(req, next){
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next({data: req.params.id, code: 422, messageKeys: ['not-found'] });
  if (!req.knowledgeMessage) return next({data: req.knowledgeMessage, code: 422, messageKeys: ['not-found'] });

  let expression = {}, projection = {};
  for (let q of Object.keys(req.knowledgeMessage)) expression["data."+q] = req.knowledgeMessage[q];

  console.log("updateMessage action request", req.params.id);

  ActionModel.update({"_id": mongoose.Types.ObjectId(req.params.id)}, expression)
    .then(data => {
      console.log("updateMessage action request");
      next(null, data);
    })
    .catch(err => {
      next(err);
    });
};
function removeMessage(req, next){
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next({data: req.params.id, code: 422, messageKeys: ['not-found'] });
  console.log("Removendo alerta:  " + req.params.id);
  ActionModel.update({"_id": mongoose.Types.ObjectId(req.params.id)},{"data.access": "private"})
    .then(data => {
      console.log("updateMessage action request");
      next(null, data);
    })
    .catch(err => {
      next(err);
    });
};
function actionRequestFull(req, res){
  ActionModel.create(req.params.id, req.params.type, req.params.action, req.knowledgeMessage)
    .then(data => {
      console.log("create request");
      next(null, data);
    })
    .catch(err => {
      next(err);
    });
};

module.exports = ctrl;
