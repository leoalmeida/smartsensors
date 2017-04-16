var _ = require('./utils');
var noble = require('../../..');
var EventEmitter = require('events').EventEmitter;
var mqtt = require('./paho.mqtt.js');

const ON_STATE = 'poweredOn';

const client = new Paho.MQTT.Client("m11.cloudmqtt.com", 30235, "web_" + parseInt(Math.random() * 100, 10)); 

var options = {
    useSSL: true,
    userName: "qqbytlln",
    password: "XsBXC40k6hXX",
    onSuccess:onConnect,
    onFailure:doFail
  }

// connect the client
client.connect(options);

// called when the client connects
  function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    client.subscribe("/cloudmqtt");
    message = new Paho.MQTT.Message("Hello CloudMQTT");
    message.destinationName = "/cloudmqtt";
    client.send(message); 
  }

  function doFail(e){
    console.log(e);
  }


var get = module.exports = function () {
  var events = new EventEmitter();
  noble.on('stateChange', function(state) {
    if (state === ON_STATE) {
      console.log("Starting scan for BLE devices");
      noble.startScanning();
    } else {
      console.log("Stop scanning for devices");
      noble.stopScanning();
    }
  });

  noble.on('discover', function(peripheral) {
    events.emit('data', peripheral);
  });

  // called when the client loses its connection
  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      events.emit('error', responseObject.errorMessage);
    }
  }

  // called when a message arrives
  function onMessageArrived(message) {
    events.emit('success', message.payloadString);
  }

  return events;
};

module.exports.print = function (callback) {
  return get().on('data', _.log);
};

module.exports.printMessages = function (callback) {
  return get().on('success', _.log);
};

module.exports.printError = function (callback) {
  return get().on('error', _.log);
};

