var EtherPortClient = require("etherport-client").EtherPortClient;
var five = require('johnny-five');
//const db = require('../../db');
const mongoose = require('mongoose');
var Knowledge = mongoose.model('Knowledge');
var Messenger = mongoose.model('Messenger');
var asyncObj = require('async');

var util = require('util');

const connectedTopics = [];
let topics;

const getTopicDecorator = require('./topic-decorator');
var topicDecorator = getTopicDecorator();

// create a queue object with concurrency 2

module.exports = getTopicDecorateIO;


let dbq = asyncObj.queue(retrieveDbInfo, 5);
let topicq = asyncObj.queue(prepareReadingsList, 5);
let updTopicq = asyncObj.queue(updateTopicStatus, 5);
let evalq = asyncObj.queue(processTopicEvaluation, 5);
let publishq = asyncObj.queue(publishEvaluation, 5);
// assign callbacks
dbq.drain = dbqDrain;
topicq.drain = topicqDrain;
updTopicq.drain = updTopicqDrain;
evalq.drain = evalTopicqDrain;
publishq.drain = publishResultsqDrain

function getTopicDecorateIO() {

  let methods = {};

  methods.processDynamic = (paramsData, cb) => {
    let topicKeys = paramsData.topicKeys;
    let coords = paramsData.coords;
    let radius = paramsData.radius;

    //console.log(topicKeys);

    let processTopic = function(id, callback) {
      verifyTopicEnabled(topicKeys[id].topicId, function(err, status){
        //console.log(status);
        if (!status) {
          console.log('Topic ' +  topicKeys[id].topicId + ' is not enabled.');
          callback({"err": 'Topic ' +  topicKeys[id].topicId + ' is not enabled.'}, null);
        }else{
          let requiredTopic = {
            topicId: topicKeys[id].topicId,
            coords: coords,
            radius: radius
          }
          requestTopics(requiredTopic, function(err, topicInfo){
            //console.log("xxxxx",topic);
            //console.log('Processing Topic: ',  topicInfo);
            topicInfo.location = {
              type: "Point",
              coordinates: coords,
              text: ""
            };
            evaluateTopics(topicInfo , function(err, evaluation){
              console.log('Subscriptions: ',  topicInfo.equipmentsObj);
              evaluation.equipments = topicInfo.equipmentsObj;
              callback(err, evaluation);
            })
          });
        };
      });
    };

    asyncObj.times(topicKeys.length, function(n, next) {
      processTopic(n, function(err, topic) {
        next(err, topic);
      });
    }, function(err, topics) {
        cb(topics);
    });
  }
  methods.processStatic = (paramsData, cb) => {
    console.log('Topic started doing the job!');
    let topicsItems = [];

    let processTopic = function(id, callback) {
      verifyTopicEnabled(topicKeys[id].topicId, function(err, status){
        if (!status) {
          console.log('Topic ' +  topicKeys[id].topicId + ' is not enabled.');
          callback({"err": 'Topic ' +  topicKeys[id].topicId + ' is not enabled.'}, null);
        }else{
          let requiredTopic = {
            topicId: topicKeys[id].topicId,
            coords: coords,
            radius: radius
          }

          requestTopics(requiredTopic, function(err, topicInfo){
            //console.log("xxxxx",topic);
            evaluateTopics(topicInfo , function(err, evaluation){
              console.log('Subscriptions: ',  topicInfo.equipmentsObj);
              evaluation.equipments = topicInfo.equipmentsObj;
              callback(err, evaluation);
            })
          });
        };
      });
    };

    asyncObj.times(topicKeys.length, function(n, next) {
      processTopic(n, function(err, topic) {
        next(err, topic);
      });
    }, function(err, topics) {
        cb(topics);
    });
  };

  return methods;
};
function requestTopics(topicKey, callback){
  dbq.push(topicKey, function (err, data) {
    if(err){
      console.log('Ocurred the following error: ', err);
      callback(err, null);
    }else{
      if(data.topic){
        console.log('****** Retrieve of');
        console.log('> Topic: ', data.topic._id);
      }
      if(data.subscriptions){
        console.log('---> Connected Equipments: ');
        for (let eqp of data.subscriptions.connected){
          console.log("--->",eqp._id);
        }
        console.log('---> Disconnected Equipments: ');
        for (let eqp of data.subscriptions.disconnected){
          console.log("--->",eqp._id);
        }
      }
      if(data.channels){
        console.log('---> Channels: ');
        for (let chn of data.channels){
          console.log("--->",chn._id);
        }
      }
      console.log("***** Finished");
      topicq.push(data, callback);
    }
  });
}
function retrieveDbInfo(task, callback){
  //console.log('Request Topic Info: ', task);
  Knowledge.findOne(mongoose.Types.ObjectId(task.topicId)).then(topic => {
    if (!topic) {
      console.log("Error: Not-found");
      callback({err:{ code: 400, msg: "Error: Not-found" }}, null);
    }
    let thisTopic = topic.toJSON();
    console.log('Request Topics from: ', thisTopic._id);

    let staticExpression = { $elemMatch: { "id": {$eq: mongoose.Types.ObjectId(thisTopic._id)}}};
    asyncObj.auto({
        subscriptions: function(cbsub) {
          if (topic.category === "dynamic")
            requestDynamicSubscriptions(topic, staticExpression, cbsub);
          else
            requestStaticSubscriptions(topic, staticExpression, cbsub);
        },
        channels: function(cbchan) {
            console.log('Get related channels');
            Knowledge.find({"relations.subscribedBy": staticExpression, "type": "channel", "data.enabled": true})
                  .then(channels => {
                    //console.log("chan: ",channels);
                    cbchan(null, channels);
                  }).catch(err => {
                    console.log("err" + err);
                    cbchan(err, null);
                  });
        }
      }, function(err, objects) {
          //console.log('err = ', err);
          console.log('results = ', objects);
          objects.topic = thisTopic;
          callback(err, objects);
      });
  }).catch(err => {
    console.log("err", err);
    callback(err, null);
  });
}

function requestDynamicSubscriptions(topic, staticExpression, task, cbsub){
  console.log('Get related equipments');
  var expression = {};
  if (task.coords) expression["location"] = {$geoWithin: { $centerSphere: [task.coords, task.radius/7871100]}};
  else expression["relations.subscribedBy"] = staticExpression;
  if (topic.data.types) expression["type"] = { $in: topic.data.types};
  if (topic.data.categories) expression["category"] = { $in: topic.data.categories};
  //expression["data.connected"] = true;

  console.log(expression);

  Knowledge.find(expression)
        .then(subscriptions => {
          let subs = {
            connected: [],
            disconnected: []
          };
          for (let sub of subscriptions){
            if (sub.data.connected) subs.connected.push(sub);
            else subs.disconnected.push(sub);
          };
          cbsub(null, subs);
        }).catch(err => {
          console.log("err" + err);
          cbsub(err, null);
        });

}

function requestStaticSubscriptions(topic, staticExpression, task, cbsub){
  console.log('Get related equipments');
  var expression = {};
  expression["relations.subscribedBy"] = staticExpression;

  console.log(expression);

  Knowledge.find(expression)
        .then(subscriptions => {
          let subs = {
            connected: [],
            disconnected: []
          };
          for (let sub of subscriptions){
            if (sub.data.connected) subs.connected.push(sub);
            else subs.disconnected.push(sub);
          };
          cbsub(null, subs);
        }).catch(err => {
          console.log("err" + err);
          cbsub(err, null);
        });

}

function prepareReadingsList(task, callback){
  console.log("----> Starting: ");
  console.log("----> ", task.topic._id.toString());
  //console.log("----> ", task);
  let listSubscriptions = [];
  for (let sub of task.subscriptions.connected){
    listSubscriptions.push(sub._id)
  }
  let expression = {};
  expression["root"] = { $in: listSubscriptions };
  Messenger.find(expression)
    .then(messages => {
      //console.log(messages);
      let msgs = {};
      if (!task.topic.category==="dynamic")
        for (let msg of messages) {
          if (!msgs[messages.root]) msgs[messages.root] = [];
          msgs[messages.root].push(msg);
        }
      else msgs = messages;
      callback(null, {
        topic: task.topic,
        equipments: listSubscriptions,
        equipmentsObj: task.subscriptions,
        channels: task.channels,
        messages: msgs
      });
    }).catch(err => {
      console.log("err" + err);
      callback(err, null);
    });
};
function evaluateTopics(topicInfo, callback){
  //console.log(topicInfo);
  evalq.push(topicInfo, function (err, data) {
    if(err){
      console.log('Ocurred the following error: ', err);
      callback(err, null);
    }else{
      if(data.topic){
        console.log('****** Evaluating...');
      }
      console.log("***** Finished");
      callback(err, data);
    }
  });
}

function processTopicEvaluation(task, callback){
  console.log("Processado:", task.topic._id);
  let results = {}, result = {};
  results.rules = [];
  let rules = task.topic.data.ruleContainer;

  for (let rule of task.topic.data.ruleContainer){
    if (rule.type === "operador"){
      results.rules.push(rule);
      continue;
    }
    if (!task.topic.category==="dynamic"){
      console.log("rule.evaluatedAttribute: ", rule.evaluatedAttribute);
      if (rule.evaluatedAttribute.type === 'number'){
        let value2 = null;
        if (rule.evaluatedAttribute.sign === "><") value2 = rule.evaluatedAttribute.value2;
        let med = calculateNumberMed(rule.evaluatedAttribute.attribute, rule.evaluatedAttribute.time, task.messages[rule.knowledge]);
        if (med<0) results.rules.push(-1)
        else results.rules.push(compareArguments(rule.evaluatedAttribute.sign, med, rule.evaluatedAttribute.value, value2));
        }else if (rule.evaluatedAttribute.type === 'boolean'){
        let med = calculateBoolMed(rule.evaluatedAttribute.attribute, rule.evaluatedAttribute.time, task.messages[rule.knowledge]);
         results.rules.push(compareArguments(rule.evaluatedAttribute.sign, med.resultmed, rule.evaluatedAttribute.value));
      }
    }else if (!rule.multiple){
      console.log("rule.evaluatedAttribute: ", rule.evaluatedAttribute);
      if (rule.evaluatedAttribute.type === 'number'){
        let value2 = null;
        if (rule.evaluatedAttribute.sign === "><") value2 = rule.evaluatedAttribute.value2;
        let med = calculateNumberMed(rule.evaluatedAttribute.attribute, rule.evaluatedAttribute.time, task.messages);
        if (med<0) results.rules.push(-1)
        else results.rules.push(compareArguments(rule.evaluatedAttribute.sign, med, rule.evaluatedAttribute.value, value2));
        }else if (rule.evaluatedAttribute.type === 'boolean'){
        let med = calculateBoolMed(rule.evaluatedAttribute.attribute, rule.evaluatedAttribute.time, task.messages);
         results.rules.push(compareArguments(rule.evaluatedAttribute.sign, med.resultmed, rule.evaluatedAttribute.value));
      }
    }else{
      if (rule.evaluatedAttributes[0].type === 'number'){
        let value2 = null;
        if (rule.evaluatedAttributes[0].sign === "><") value2 = rule.evaluatedAttributes[0].value2;
        let med = calculateNumberMed(rule.evaluatedAttributes[0].attribute, rule.evaluatedAttributes[0].time, task.messages);
        results.rules.push(compareArguments(rule.evaluatedAttributes[0].sign, med, rule.evaluatedAttributes[0].value, value2));
      }else if (rule.evaluatedAttributes[0].type === 'boolean'){
        let med = calculateBoolMed(rule.evaluatedAttribute.attributes[0], rule.evaluatedAttribute.time, task.messages);
        results.rules.push(compareArguments(rule.evaluatedAttributes[0].sign, med.resultmed, rule.evaluatedAttributes[0].value));
      }
    }
  }

  if (results.length > 1){
    for (let i = 0; i < results.rules.length; i = i+3){
      result = {err: null, data: compareConnectors(results.rules[0], results.rules[1], results.rules[2])};
    }
  }else{
    if (results.rules[0] < 0) {
      result.err = {msg: "no-readings", code: -1};
      result.value = false;
    }else {
      result.err = null;
      result.value = results.rules[0];
    }
  }
  result.sync = Date.now();

  updateTopicEvaluation(task.topic._id, task.location, task.channels, result, callback);
}

function updateTopicEvaluation(topicId, location, channels, result, callback){
  //console.log('Topic Status change Requested for: ', channels);
  publishq.push({id: topicId, location: location, channels: channels, result: result}, function(err, data){
    console.log("Publicado com sucesso");
    callback(err, {result: result, data: data});
  })
}
function publishEvaluation(task, callback){
  if (!task.result)
    callback({ data: task, code: 422, messageKeys: ['not-found'] }, null);

    //console.log(task);
  let newVal = new Messenger({ root: task.id, location: task.location, type: 'reading', category: 'message' , data: task.result });
  newVal.relations.ownedBy.push({
    id: mongoose.Types.ObjectId(task.id)
  });
  newVal.relations.connectedTo.push({
    id: mongoose.Types.ObjectId(task.channelId)
  });

  let updateDate = newVal.sync;

  asyncObj.auto({
      message: function(cb) {
        console.log('Send message update');
        //console.log(newVal);
        Messenger.create(newVal)
          .then(data => {
            console.log("Message successfully sent:  ", data._id);
            cb(null, data);
          })
          .catch(err => {
            console.log('Readings Synchronization failed:', err);
            cb(err, null);
          });
      },
      topic: function(cb) {
          console.log('update related topic');
          Knowledge.update({"_id": mongoose.Types.ObjectId(task.id)}, {$set: {"data.status": "", "data.updatedValue": task.result, "sync": updateDate}})
            .then(data => {
              console.log("Topic successfully changed:  ", data);
              cb(null, data);
            })
            .catch(err => {
              console.log('Readings Synchronization failed:', err);
              cb(err, null);
            });
      },
      channel: function(cb) {
          console.log('update related channel');
          Knowledge.update({"_id": mongoose.Types.ObjectId(task.channels[0]._id)},
                {$set: {
                  "sync": Date.now(),
                  $push: {'relations.connectedTo': {
                    id: mongoose.Types.ObjectId(newVal._id),
                    sync: updateDate
                }}}})
            .then(data => {
              console.log("Channel successfully changed:  ", data);
              cb(null, data);
            })
            .catch(err => {
              console.log('Readings Synchronization failed:', err);
              cb(err, null);
            })
      }
    }, function(err, objects) {
        //console.log('err = ', err);
        //console.log('results = ', objects);
        callback(err, objects)
    });
};

//------ helper function

function startTopic(topic){
  switch (equip.category) {
    case "static":
      return topicDecorator.startStatic(topic, null);
      break;
    case "dynamic":
      return topicDecorator.startDynamic(topic, null);
      break;
  }
};
function updateTopicStatus(task, callback){
  console.log('Topic Status change Requested for: ', task.equipmentId);
  console.log("to status :", (task.status)? "connected": "disconnected" );
  let item = Knowledge.update({"_id" : mongoose.Types.ObjectId(task.equipmentId)}, {$set: {"data.connected": task.status}})
              .catch(err => {
                console.log("err" + err);
                callback(err, null);
              });
  callback(null, item);
}
function verifyTopicStatus(objectid, callback){
  Knowledge.findOne({"_id" : mongoose.Types.ObjectId(objectid)},{"data.connected": 1})
            .then(data => {
              console.log(data);
              callback(null, data.data.connected);
            })
            .catch(err => {
              console.log("err" + err);
              callback(err, null);
            });
}
function verifyTopicEnabled(objectid, callback){
  Knowledge.findOne({"_id" : mongoose.Types.ObjectId(objectid)}, {"data.enabled": 1})
            .then(data => {
              console.log(data);
              callback(null, data.data.enabled);
            })
            .catch(err => {
              console.log("err" + err);
              callback(err, null);
            });
}
function dbqDrain() {
  console.log('No more topics to retrieve.');
  //console.log('Finished to retrieve: ' +  topics.length + ' topics.');
  //topicq.push(topics, topicsConnected);
  //let req = requestTopics(topics);
}
function topicqDrain() {
  console.log('No more topics to start.');
}
function updTopicqDrain() {
  console.log('No more topics to update.');
}
function evalTopicqDrain(){
  console.log('No more topics to evaluate.');
}
function publishResultsqDrain(){
    console.log('No more results to publish.');
}

function findByCategory(element, index, array){
  if (element.category === this) return true;
    else return false;
}

function calculateBoolMed(attribute, time, messages){
  let truesum = 0, falsesum = 0, totalsum = 0;
  for(let msg of messages){
    if (msg.data.date < Date.now() - time) continue;
    if (msg.data[attribute]) truesum++;
    else falsesum++;
  }
  totalsum = truesum+falsesum;
  if (!totalsum) return {
    resultmed: false,
    falsepct: 0,
    truepct: 0
  };
  return {
    resultmed: (totalsum/2 > falsesum),
    falsepct: (falsesum*100)/totalsum,
    truepct: (truesum*100)/totalsum
  };
}

function calculateNumberMed(attribute, time, messages){
  let sum = 0, count = 0;
  for(let msg of messages){
    if (msg.data.date < Date.now() - time) continue;
    sum = sum + msg.data[attribute];
    count++;
  }
  if (!count) return -1;
  return (sum/count);
}

function getConnector(connectorCategory){
  const connectors = [{
        "icon" : "assets/icons/communication/ic_call_merge_24px.svg",
        "category" : "AND",
        "max" : 2.0,
        "label" :"AND",
        "subtype" : "boleano",
        "type" : "operador"
      },
      {
        "icon" : "assets/icons/communication/ic_call_split_24px.svg",
        "category" : "OR",
        "max" : 2.0,
        "label" :"OR",
        "subtype" : "boleano",
        "type" : "operador"
      },
      {
        "icon" : "assets/icons/notification/ic_priority_high_48px.svg",
        "category" : "NOT",
        "max" : 1.0,
        "label" :"NOT",
        "subtype" : "boleano",
        "type" : "operador"
      },
      {
        "icon" : "assets/icons/action/ic_greaterthansign.svg",
        "category" : "GT",
        "max" : "2",
        "label" :"Maior que",
        "subtype" : "relacional",
        "type" : "operador"
      },
      {
        "icon" : "assets/icons/action/ic_greaterequalsign.svg",
        "category" : "GE",
        "max" : "2",
        "label" :"Maior ou igual",
        "subtype" : "relacional",
        "type" : "operador"
      },
      {
        "icon" : "assets/icons/action/ic_lessthansign.svg",
        "category" : "LT",
        "max" : "2",
        "label" :"Menor que",
        "subtype" : "relacional",
        "type" : "operador"
      },
      {
        "icon" : "assets/icons/action/ic_lessequalsign.svg",
        "category" : "LE",
        "max" : "2",
        "label" :"Menor ou igual",
        "subtype" : "relacional",
        "type" : "operador"
      },
      {
        "icon" : "assets/icons/action/ic_equalsign.svg",
        "category" : "EQ",
        "max" : "2",
        "label" :"Igual a",
        "subtype" : "relacional",
        "type" : "operador"
      },
      {
        "icon" : "assets/icons/action/ic_leftparenthesis.svg",
        "category" : "LP",
        "label" :"( parêntesis",
        "subtype" : "parêntesis",
        "type" : "separador"
      },
      {
        "icon" : "assets/icons/action/ic_rightparenthesis.svg",
        "category" : "RP",
        "label" :") parêntesis",
        "subtype" : "parêntesis",
        "type" : "separador"
      },
      {
        "icon" : "assets/icons/action/ic_notequalsign.svg",
        "category" : "NE",
        "label" :"Diferente de",
        "subtype" : "relacional",
        "type" : "operador"
      }]
  return connectors.find(findByCategory, connectorCategory);
}

function getSign(signCategory){
  const signs = [{
          "icon": "",
          "label" : "Maior",
          "category" : ">",
          "type" : "sign"
        },
        {
          "icon": "",
          "label" : "Menor",
          "category" : "<",
          "type" : "sign"
        },
        {
          "icon": "",
          "label" : "Igual",
          "category" : "==",
          "type" : "sign"
        },
        {
          "icon": "",
          "label" : "Diferente",
          "category" : "<>",
          "type" : "sign"
        },
        {
          "icon" : "",
          "category" : "><",
          "label" :"Entre",
          "type" : "sign"
        }];
  return signs.find(findByCategory, signCategory);
}

function compareConnectors(arg1, connector, arg2){
  switch (connector) {
    case "AND":
      return (arg1 && arg2);
      break;
    case "OR":
      return (arg1 || arg2);
      break;
    default:
      return false;
  }
}

function compareArguments(sign, arg1, arg2, arg3){
  switch (sign) {
    case ">":
      if (arg1 > arg2) return true;
      break;
    case ">=":
      if (arg1 >= arg2) return true;
      break;
    case "<":
      if (arg1 < arg2) return true;
      break;
    case "<=":
      if (arg1 <= arg2) return true;
      break;
    case "==":
      if (arg1 == arg2) return true;
      break;
    case "<>":
      if (arg1 != arg2) return true;
      break;
    case "><":
      if (arg3 > arg1 && arg3 < arg2) return true;
      break;
    default:
      return false;
  }
}
