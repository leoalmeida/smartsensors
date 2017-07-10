//motion
var five = require('johnny-five');
const mongoose = require('mongoose');
var Messenger = mongoose.model('Messenger');
var Knowledge = mongoose.model('Knowledge');

function getTopicDecorator() {
  return {
    startStatic: startStatic,
    startDynamic: startDynamic
  };

  function startStatic (topic, socket) {
    console.log('Starting Motion');
    let confs = {};
    for (let conf of topic.data.configurations){
      confs[conf.attribute] = conf.value;
    }
    let object = new five.Motion({
        pin: confs["pin"],
        id: topic._id
    });
    object.label = topic.label;
    object.type = topic.type;
    object.category = topic.category;
    object.enabled = topic.data.enabled;
    object.connected = topic.data.connected;
    object.location = topic.location;
    object.topic = topic.topic;
    object.root = topic.root;
    object.lastReading = object.detectedMotion;

    object.toggleConnect = function (updated){
        //this.connected ? false : true;
        object.connected = updated.connected;
    };

    object.toggleEnable = function (updated){
        object.toggleConnect(updated);
    };


    if (socket) console.log('Motion sockets on connection');

    object.on("calibrated", function () {
        console.log("Topic " + object.id + " Calibrado", Date.now());
        if (socket) socket.emit('motionData', "Calibrado");
    });

    object.on("motionstart", function () {
        console.log("Topic " + object.id);
        console.log("Identificou movimentação", Date.now());
        if (socket) socket.emit('motionData', "Mov");
    });

    object.on("motionend", function () {
        console.log("Topic " +object.id);
        console.log("Fim de movimentação ", Date.now());
        if (socket) socket.emit('motionData', "Fim");
    });

    object.on("change", function (data) {
        //console.log("Topic: " + object.id);
        //console.log("Leitura:" + JSON.stringify(data));

        console.log("detectedMotion: " + object.detectedMotion);
        //console.log("last: " + object.lastReading);
        //console.log("connected: " + object.connected);
        //console.log("enabled: " + object.enabled);

        if (data.detectedMotion == object.lastReading) return;

        object.lastReading = data.detectedMotion;

        let lastUpdate = {
            date: Date.now(),
            level: "",
            nonscaled: "",
            topic:{
              label: object.label,
              type: object.type,
              category: object.category
            },
            unit: "",
            value: (data.detectedMotion ? 1 : 0),
            raw: data,
            loops: 0
        };
        //console.log("lastUpdate: ", lastUpdate);
        publishReadings(object.lastReading, lastUpdate, object);

        if (socket) socket.emit('motionData', (data.detectedMotion ? "Sim" : "Não"));
    });

    if (socket) socket.emit('motionData', 'On');
    console.log('Motion Created');
    return object;
  };
  function startDynamic(topic, socket) {
      console.log('Starting Dynamic Topic');
      let confs = {};
      for (let conf of topic.data.configurations){
        confs[conf.attribute] = conf.value;
      }
      let object = new five.Sensor({
          pin: confs["pin"],
          freq: confs["loop"],
          threshold: confs["threshold"],
          id: topic._id
      });
      object.label = topic.label;
      object.type = topic.type;
      object.category = topic.category;
      object.enabled = topic.enabled;
      object.connected = topic.connected;
      object.location = topic.location;
      object.topic = topic.topic;
      object.root = topic.root;
      object.unit = confs["unit"];
      object.toggleConnect = function (updated){
          //this.connected ? false : true;
          object.connected = updated.connected;
      };

      object.toggleEnable = function (updated){
          object.toggleConnect(updated);
      };
      console.log('Sensor sockets on connection');

      // Scale the topic's data from 0-1023 to 0-10 and log changes
      object.on("change", function() {
          this.scaledReadingValue = this.scaleTo(0, 100);

          if (this.scaledReadingValue == object.lastReading) return;

          let lastUpdate = {
              date: Date.now(),
              level: object.level,
              nonscaled: "",
              topic:{
                label: object.label,
                type: object.type,
                category: object.category
              },
              unit: object.unit,
              value: this.scaledReadingValue,
              raw: this,
              loops: 0
          };

          console.log("The reading value has changed.");

          console.log("New reading: " + this.scaledReadingValue );

          publishReadings(this.scaledReadingValue,lastUpdate, object);

          if (socket) socket.emit('sensorData', this.scaledReadingValue);
      });
      if (socket) socket.emit('sensorData', 'On');

      console.log('Sensor Created');
      return object;
  };


  //------ helper function
  function publishReadings(updatedValue, reading, object){
    if (!reading) console.log({ data: reading, code: 422, messageKeys: ['not-found'] });
    //console.log(reading);
    let newVal = new Messenger({ root: object.id, location: object.location, type: 'alert', category: 'message' , data: reading });
    //console.log(newVal);
    newVal.relations.ownedBy.push({
      id: mongoose.Types.ObjectId(object.root)
    });
    newVal.relations.connectedTo.push({
      id: mongoose.Types.ObjectId(object.id)
    });
    Messenger.create(newVal)
      .then(data => {
        console.log("Alert changed:  ", data._id);
      })
      .catch(err => {
        console.log('Readings Synchronization failed:', err);
      });
    Knowledge.update({"_id": mongoose.Types.ObjectId(object.id)}, {$set: {"data.updatedValue": updatedValue}})
      .then(data => {
        console.log("Updated Value changed:  ", updatedValue);
      })
      .catch(err => {
        console.log('Readings Synchronization failed:', err);
      });
  };

  function bindAlarm(object) {
      let updatedValue = parseFloat(Math.round(object.lastReading.y * 100) / 100).toFixed(2);
      let lastUpdate = {
          date: object.lastReading.x,
          level: "",
          nonscaled: "",
          topic:{
            label: object.template.label,
            type: object.type,
            category: object.category
          },
          unit: "l",
          value: updatedValue,
          raw: object.lastReading.y,
          loops: object.pulses
      };
      console.log("--> Last State:" + object.lastFlowPinState);

      publishReadings(updatedValue, lastUpdate, object);
  };
  function getDateString() {
      var time = new Date();
      // 10800000 is (GMT-3 Montreal)
      // for your timezone just multiply +/-GMT by 3600000
      var datestr = new Date(time - 10800000).toISOString().replace(/T/, ' ').replace(/Z/, '');
      return datestr;
  }
};

module.exports = getTopicDecorator;
