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

// Accepts the connection if the username and password are valid
var authenticate = function(client, username, password, callback) {
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
var authorizePublish = function(client, topic, payload, callback) {
  console.log("client: " + client.id);
  console.log("topic: " + topic);

  if (!mongoose.Types.ObjectId.isValid(client.id)) return callback({ data: client.id, code: 422, messageKeys: ['not-found'] }, false);
  let topicSplitted = topic.split('/')
  if (!mongoose.Types.ObjectId.isValid(topicSplitted[0])) return callback({ data: client.id, code: 422, messageKeys: ['not-found'] }, false);

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
var authorizeSubscribe = function(client, topic, callback) {
  //console.log("client: " + client.id);
  //console.log("topic: " + topic);
  if (!mongoose.Types.ObjectId.isValid(client.id)) return callback({ data: client.id, code: 422, messageKeys: ['not-found'] }, false);
  let topicSplitted = topic.split('/')
  if (!mongoose.Types.ObjectId.isValid(topicSplitted[0])) return callback({ data: client.id, code: 422, messageKeys: ['not-found'] }, false);

  if (topicSplitted.length > 2) return callback(null, false);
  else if (topicSplitted.length === 1){
    //console.log("_id: " + topicSplitted[0]);
    //console.log("subscriber: " + client.id);
    Knowledge.findOne({"_id": ObjectId(topicSplitted[0]), "relations.subscribedBy.id": ObjectId(client.id)},{"relations.subscribedBy.id":1,"relations.subscribedBy.view":1}).then(topicKldg => {
      if (!topicKldg) return callback(null, false);
      //console.log("knldg: ", topicKldg);
      for (let relation of topicKldg.relations.subscribedBy){
        //console.log("relation: ", relation.id);
        //console.log("subscriber: ", client.id);
        if (relation.id == client.id) return callback(null, relation.view);
      }
      return callback(null, false);
    })
    .catch(err => {
      console.log("err" + err);
       return callback(err, false);
    });
  } else if (topicSplitted[1] === "action") return callback(null, (client.id === topicSplitted[0]));
  else return callback(err, false);
}

let broker = new mosca.Server(serverSettings.mqtt, function onCreated(err, broker) {
  // assume no errors
  console.log('MQTT broker is up and running');
});

broker.on('ready', setup);

var topics = {};

function setup() {
  console.log('MQTT broker is ready');
  broker.authenticate = authenticate;
  broker.authorizePublish = authorizePublish;
  broker.authorizeSubscribe = authorizeSubscribe;

  //setInterval(publishMessage, 30000);
  //setInterval(verifyConnected, 30000);
}

broker.on('clientConnected', (client) => {
    console.log('client connected', client.id);
    topics[client.id] = {};
    topics[client.id].type = "push";
    console.log('type: ', topics[client.id]);

    Knowledge.findOne({"_id": ObjectId(client.id)}).then(profile => {
      if (profile) {
        console.log('profile: ', profile.relations);
        topics[client.id].profiles = profile.relations.subscribedBy;
        publishMessage([client.id,"action"].join("/"), profile.relations.subscribedBy, "profiles");
      }
    }).catch(err => console.log("err" + err));

});

broker.published = function(packet, client, cb) {
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
    console.log('publish client: ', client.id);
    console.log('published packet: ', packet);
    const buf = Buffer.from(packet.payload);
    let message = buf.toString('utf8');
    console.log("mensagem: ", message);
    let messageObject = {};
    console.log('client published message from type: ', typeof message);
    if (typeof message !== 'object'){
      messageObject = JSON.parse(message);
      //console.log('published value: ', messageObject.data);
    }else{
      messageObject = message;
      //console.log('published value: ', messageObject);
    }
  if (messageObject.type === "update"){
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
broker.on('subscribed', function(topic, client) {
  console.log('subscribed : ', topic);
  console.log('client : ', client.id);
  //publishMessage();
});

// fired when a client subscribes to a topic
broker.on('unsubscribed', function(topic, client) {
  console.log('unsubscribed : ', topic);
  console.log('client : ', client.id);
});


// fired when a client is disconnecting
broker.on('clientDisconnecting', function(client) {
  console.log('clientDisconnecting : ', client.id);
});
// fired when a client disconnects
broker.on('clientDisconnected', function(client) {
  console.log('Client Disconnected:', client.id);
  delete topics[client.id];
});

//var topicOfInterest = '58f3ac46866064c6189ec932';

function publishMessage(topic, data, type) {
  console.log("data:   ",data);

  if (!data) return;
  var id = topic.split('/')[0];
  var objectPayload = {
    _id: id,
    type: 'action',
    category: 'profiles',
    data: data,
    sync: Date.now(),
    access: id
  };

  //objectPayload.data["updatedValue"] = status;
  //objectPayload.sync = Date.now();
  //objectPayload.data.message = "Atualização de leitura: " + ((status)?"Movimentação Identificada":"Fim de movimentação");

  var textPayload = JSON.stringify(objectPayload);
  var bufferPayload = new Buffer(textPayload, 'utf-8');

  console.log("text:   ",textPayload);

  var packet = {
    topic: topic,
    payload: textPayload,
    //payload: bufferPayload,
    qos: 1,
    retain: true,
  };

  console.log('\n\n#########################################');
  console.log('MQTT broker sending message to board ..\n');

  console.log("pack:   ",packet);

  broker.publish(packet, function() {
    console.log('MQTT broker message sent');
  });
}

function verifyConnected() {
  var topicList = Object.keys(topics);
  console.log('Topic list: ', topicList);
  for (let topic of topicList){
    if (topics[topic] === "pull") requestUpdate(topic)
  }
}

var value = 0;

function requestUpdate(topic){
  let payload = objectPayload;
  console.log('new Update');
/*  payload.data["updatedValue"] = value++;
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
  });*/
}


console.log(process.pid);

module.exports = broker;
