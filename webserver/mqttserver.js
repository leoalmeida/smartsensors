'use strict';

const mongoose = require("mongoose")
var mosca = require('mosca');
var serverSettings = require('./app/config/mqttconfig');

var connect = function(){
   var options = {
      server: {
         socketOptions:{
            keepAlive : 1
         }
      }
   };
   mongoose.connect(serverSettings.db,options);
};
connect();

mongoose.connection.on('error',console.log);
mongoose.connection.on('disconnected',connect);
console.log('Mongo db connected');

var Knowledge = mongoose.model('Knowledge');
var ObjectId = require('mongodb').ObjectID;

// Topics Collection
var topics = {};

let broker = new mosca.Server(serverSettings.mqtt, (err, broker) => {
  // assume no errors
  console.log('MQTT broker is up and running');
  //setInterval(publishMessage, 30000);
  //setInterval(verifyConnected, 1000);
});

// Accepts the connection if the username and password are valid
broker.authenticate = (client, username, password, callback) => {
  console.log('autenticando: ',client.id);
  //console.log('username: ',username);
  //console.log('password: ',password.toString());

  if (!username && !password) return callback(null, true);

  if (!mongoose.Types.ObjectId.isValid(client.id)) return callback({ data: client.id, code: 422, messageKeys: ['not-found'] }, false);

  Knowledge.findOne({"_id": ObjectId(client.id)}).then(profile => {
    if (!profile) {
      callback(null, false);
    }
    var authorized = (username === profile.data.uid && password.toString() === profile.data.token.value);
    if (authorized) client.profile = profile;
    return callback(null, authorized);
  })
  .catch(err => {
    console.log("err" + err);
    return callback(err, false);
  });
}
// In this case the client authorized as alice can publish to /users/alice taking
// the username from the topic and verifing it is the same of the authorized user
broker.authorizePublish = (client, topic, payload, callback) => {
  console.log("client: " + client.id);
  console.log("topic: " + topic);

  let topicSplitted = topic.split('/');
  if (client.id !== "complexServer" && client.id !== "processServer"){
    if (!mongoose.Types.ObjectId.isValid(client.id)) return callback({ data: client.id, code: 422, messageKeys: ['not-found'] }, false);
    if (!mongoose.Types.ObjectId.isValid(topicSplitted[0])) return callback({ data: client.id, code: 422, messageKeys: ['not-found'] }, false);
  }else if (topicSplitted[1] === "processTopicSub" || topicSplitted[1] === "processTopicPub"){
    console.log("public complexServer");
    return callback(null, true);
  }

  if (topicSplitted.length > 2) return callback(null, false);
  else if (topicSplitted.length === 1) return callback(null, (topicSplitted[0] === client.id));
  else if (topicSplitted[1]  === "action"){
    Knowledge.findOne({"_id": ObjectId(topicSplitted[0]), "relations.subscribedBy.id": ObjectId(client.id)},{"relations.subscribedBy.id":1,"relations.subscribedBy.publish":1}).then(topicKldg => {
      if (!topicKldg) return callback(null, false);
      //console.log("knldg: ", topicKldg);
      for (let relation of topicKldg.relations.subscribedBy){
        //console.log("relation: ", relation.id);
        //console.log("subscriber: ", client.id);
        if (relation.id == client.id) return callback(null, relation.publish);
      }
      return callback(null, false);
    })
    .catch(err => {
      console.log("err" + err);
      return callback(err, false);
    });
  }else return callback(null, false);
}
// In this case the client authorized as alice can subscribe to /users/alice taking
// the username from the topic and verifing it is the same of the authorized user
broker.authorizeSubscribe = (client, topic, callback) => {
  //console.log("client: " + client.id);
  //console.log("topic: " + topic);
  if (!mongoose.Types.ObjectId.isValid(client.id)) return callback({ data: client.id, code: 422, messageKeys: ['not-found'] }, false);
  let topicSplitted = topic.split('/')
  if (!mongoose.Types.ObjectId.isValid(topicSplitted[0])) return callback({ data: client.id, code: 422, messageKeys: ['not-found'] }, false);

  if (topicSplitted.length > 2) return callback(null, false);
  else if (topicSplitted.length === 1){
    console.log("_id: " + topicSplitted[0]);
    console.log("subscriber: " + client.id);

    Knowledge.aggregate(
        [{$match : {"_id": ObjectId(topicSplitted[0])}},
        { $unwind : "$relations.subscribedBy" },
        { $project : { id : "$relations.subscribedBy.id" , view : "$relations.subscribedBy.view", "_id" : 0 } },
        { $match : {"id": ObjectId(client.id)}}]).then(topicKldg => {

    //Knowledge.findOne({"_id": ObjectId(topicSplitted[0]), "relations.subscribedBy.id": ObjectId(client.id)},{"relations.subscribedBy.id":1,"relations.subscribedBy.view":1}).then(topicKldg => {
      if (!topicKldg) return callback(null, false);
      console.log("knldg: ", topicKldg[0]);

      //for (let relation of topicKldg.relations.subscribedBy){
        //console.log("relation: ", relation.id);
        //console.log("subscriber: ", client.id);
        //if (relation.id == client.id) return callback(null, relation.view);
      //}
      //return callback(null, false);
      return callback(null, topicKldg[0].view);
    })
    .catch(err => {
      console.log("err" + err);
       return callback(err, false);
    });
  } else if (topicSplitted[1] === "action") return callback(null, (client.id === topicSplitted[0]));
  else return callback(err, false);
}

broker.clientConnected = (client) => {
    console.log('client connected', client.id);
    //startBasicTopic(client.id);
};

broker.published = (packet, client, cb) => {
  if(!client){
    // new subscription
    console.log('Server internals!!');
  }else if ((packet.topic.indexOf('echo') === 0) ||
      (packet.topic.indexOf('connected') === 0) ||
      (packet.topic.indexOf('disconnected') === 0)){
    //console.log('published server: ', packet.toString('utf8'));
    console.log('Server echo!!');
    return cb();
  }else{
    // regular client message
    //if (!client) {}
    console.log('Regular message');
    console.log('publish client: ', client.id);
    //console.log('published packet: ', packet);
    const buf = Buffer.from(packet.payload);
    let message = buf.toString('utf8');
    //console.log("mensagem: ", message);
    let messageObject = {};
    //console.log('client published message from type: ', typeof message);
    if (typeof message !== 'object'){
      messageObject = JSON.parse(message);
      //console.log('published value: ', messageObject.data);
    }else{
      messageObject = message;
      //console.log('published value: ', messageObject);
    }
  if (messageObject.type === "update" && client.id !== "processServer"){
    console.log('atualizando: ', messageObject.data.profile);
    Knowledge.update({_id: ObjectId(messageObject._id)}, {$set: {sync: Date.now(), "data.updatedValue": messageObject.data.updatedValue}})
      .then(data => {
        console.log("pushRelations request");
        return cb();
      }).catch(err => {
        return cb(err);
      });
  }else{
    console.log('published command: ', messageObject.data.command);
    console.log('published pin: ', messageObject.data.pin);
    console.log('published config: ', messageObject.data.config);
  }
    /*var newPacket = {
      topic: 'echo/' + packet.topic,
      payload: packet.payload,
      retain: packet.retain,
      qos: packet.qos
    };
    //  console.log('newPacket', newPacket);
    broker.publish(newPacket, cb);*/
    //console.log('published messageObject from client: ', typeof messageObject, messageObject);
    //console.log(JSON.parse(packet.payload.toString()))
  }
};

// fired when a client subscribes to a topic
broker.subscribed = (topic, client) => {
  console.log('subscribed : ', topic);
  console.log('client : ', client.id);
  //publishMessage();
};

// fired when a client subscribes to a topic
broker.unsubscribed = (topic, client) => {
  console.log('unsubscribed : ', topic);
  console.log('client : ', client.id);
};
// fired when a client is disconnecting
broker.clientDisconnecting = (client) => {
  console.log('clientDisconnecting : ', client.id);
};
// fired when a client disconnects
broker.clientDisconnected = (client) => {
  console.log('Client Disconnected:', client.id);
  delete topics[client.id];
};

broker.forwardRetained = (topic, client, cb) => {
  cb(true);
}

broker.forwardOfflinePackets = (client, cb) => {
  cb(true);
}

/*
function publishMessage(topic, data, category) {
  console.log("data:   ",data);

  if (!data) return;
  var id = topic.split('/')[0];
  var type = topic.split('/')[1];
  var objectPayload = {
    _id: id,
    type: type,
    category: category,
    data: data,
    sync: Date.now(),
    access: id
  };

  //objectPayload.data["updatedValue"] = status;
  //objectPayload.sync = Date.now();
  //objectPayload.data.message = "Atualização de leitura: " + ((status)?"Movimentação Identificada":"Fim de movimentação");

  var messagePayload = JSON.stringify(objectPayload);
  //var bufferPayload = new Buffer(messagePayload, 'utf-8');

  //console.log("message:   ",messagePayload);

  var packet = {
    topic: (category === "process")?"processServer":topic,
    payload: messagePayload,
    //payload: bufferPayload,
    qos: 0,
    retain: false,
  };

  console.log('\n\n#########################################');
  console.log(' broker sending action message ..\n');

  console.log("pack:   ",packet);

  broker.publish(packet, function() {
    console.log('MQTT broker message sent');
  });
}
*/
/*
function verifyConnected() {
  var topicList = Object.keys(topics);
  //console.log('Topic list: ', topicList);
  for (let topic of topicList){
    var topicItem = topics[topic];
    if (!topicItem.processing && (topicItem.lastSync + topicItem.frequency < Date.now()))
      if (topicItem.type === "pull") requestUpdate(topic);
  }
}
*/
/*
function requestUpdate(topic){
  topics[topic].processing = true;
  let payload = objectPayload;
  console.log('new Update request');
  payload.data["updatedValue"] = value++;
  var textPayload = JSON.stringify(payload);
  //var bufferPayload = new Buffer(textPayload, 'utf-8');

  var packet = {
    topic: topic,
    payload: textPayload,
    //payload: bufferPayload,
    qos: 1,
    retain: false,
  };

  console.log('\n\n#########################################');
  console.log('MQTT broker sending message to board ..\n');

  broker.publish(packet, function() {
    console.log('MQTT broker message sent');
  });
}
*/
console.log(process.pid);

module.exports = broker;
