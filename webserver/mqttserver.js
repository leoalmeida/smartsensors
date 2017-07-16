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
  callback(null, client.user == topic.split('/')[1]);
}

// In this case the client authorized as alice can subscribe to /users/alice taking
// the username from the topic and verifing it is the same of the authorized user
var authorizeSubscribe = function(client, topic, callback) {
  callback(null, topic.split('/')[1] != "");
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

  setInterval(publishMessage, 30000);
  setInterval(verifyConnected, 30000);
}

broker.on('clientConnected', (client) => {
    console.log('client connected', client.id);
    topics[client.id] = "pull";
    console.log('type: ', topics[client.id]);
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
    console.log('publish client: ', client);
    console.log('published packet: ', packet);
    const buf = Buffer.from(packet.payload);
    let message = buf.toString('utf8');
    console.log("mensagem: ", message);
    let messageObject = {};
    console.log('client published message from type: ', typeof message);
    if (typeof message !== 'object'){
      let messageObject = JSON.parse(message);
      console.log('published value: ', messageObject.data.updatedValue);
    }else{
      messageObject = message;
      console.log('published value: ', messageObject);
    }

    KnowledgeModel.update({_id: ObjectId(messageObject._id)}, {$set: {sync: Date.now()}})
      .then(data => {
        console.log("pushRelations request");
        return cb();
      }).catch(err => {
        return cb(err);
      });

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
  publishMessage();
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

var topicOfInterest = '58f3ac46866064c6189ec932';

var objectPayload = {
  _id: '58f3ac46866064c6189ec932',
  type: 'sensor',
  category: 'motion',
  data: {
    updatedValue: false,
    message: "",
    profile: '58f3ac46866064c6189ec932'
  },
  sync: Date.now(),
  access: "public"
};
var status = true;
function publishMessage() {
  status = !status;
  objectPayload.data["updatedValue"] = status;
  objectPayload.sync = Date.now();
  objectPayload.data.message = "Atualização de leitura: " + ((status)?"Movimentação Identificada":"Fim de movimentação");
  var textPayload = JSON.stringify(objectPayload);
  var bufferPayload = new Buffer(textPayload, 'utf-8');

  var packet = {
    topic: topicOfInterest,
    payload: textPayload,
    //payload: bufferPayload,
    qos: 1,
    retain: true,
  };

  console.log('\n\n#########################################');
  console.log('MQTT broker sending message to board ..\n');

  broker.publish(packet, function() {
    console.log('MQTT broker message sent');
  });
}

function verifyConnected() {
  var topicList = Object.keys(topics);
  console.log('Topics list using pull: ', topicList);
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
