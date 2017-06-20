//motion
var five = require('johnny-five');
const mongoose = require('mongoose');
var Messenger = mongoose.model('Messenger');
var Knowledge = mongoose.model('Knowledge');

function getEquipmentDecorateIO(db) {
  return {
    startMotion: startMotion,
    startSensor: startSensor,
    startFlow: startFlow,
    startHygrometer: startHygrometer,
    startThermometer: startThermometer,
    startLight: startLight,
    startRelay: startRelay,
    startLed: startLed
  };

  function startMotion (equipment, socket) {
    console.log('Starting Motion');
    let confs = {};
    for (let conf of equipment.data.configurations){
      confs[conf.attribute] = conf.value;
    }
    let object = new five.Motion({
        pin: confs["pin"],
        id: equipment._id
    });
    object.label = equipment.label;
    object.type = equipment.type;
    object.category = equipment.category;
    object.enabled = equipment.data.enabled;
    object.connected = equipment.data.connected;
    object.location = equipment.location;
    object.equipment = equipment.equipment;
    object.root = equipment.root;
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
        console.log("Equipment " + object.id + " Calibrado", Date.now());
        if (socket) socket.emit('motionData', "Calibrado");
    });

    object.on("motionstart", function () {
        console.log("Equipment " + object.id);
        console.log("Identificou movimentação", Date.now());
        if (socket) socket.emit('motionData', "Mov");
    });

    object.on("motionend", function () {
        console.log("Equipment " +object.id);
        console.log("Fim de movimentação ", Date.now());
        if (socket) socket.emit('motionData', "Fim");
    });

    object.on("change", function (data) {
        //console.log("Equipment: " + object.id);
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
            equipment:{
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
  function startSensor(equipment, socket) {
      console.log('Starting Sensor');
      let confs = {};
      for (let conf of equipment.data.configurations){
        confs[conf.attribute] = conf.value;
      }
      let object = new five.Sensor({
          pin: confs["pin"],
          freq: confs["loop"],
          threshold: confs["threshold"],
          id: equipment._id
      });
      object.label = equipment.label;
      object.type = equipment.type;
      object.category = equipment.category;
      object.enabled = equipment.enabled;
      object.connected = equipment.connected;
      object.location = equipment.location;
      object.equipment = equipment.equipment;
      object.root = equipment.root;
      object.unit = confs["unit"];
      object.toggleConnect = function (updated){
          //this.connected ? false : true;
          object.connected = updated.connected;
      };

      object.toggleEnable = function (updated){
          object.toggleConnect(updated);
      };
      console.log('Sensor sockets on connection');

      // Scale the equipment's data from 0-1023 to 0-10 and log changes
      object.on("change", function() {
          this.scaledReadingValue = this.scaleTo(0, 100);

          if (this.scaledReadingValue == object.lastReading) return;

          let lastUpdate = {
              date: Date.now(),
              level: object.level,
              nonscaled: "",
              equipment:{
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
  function startFlow(equipment, socket) {
    console.log('Starting Flow');
    let confs = {};

    for (let conf of equipment.data.configurations){
      confs[conf.attribute] = conf.value;
    }
    let object = new five.Sensor.Digital({
        id: equipment._id,
        pin: confs["pin"],
    });
    object.label = equipment.label;
    object.type = equipment.type;
    object.category = equipment.category;
    object.enabled = equipment.enabled;
    object.connected = equipment.connected;
    object.root = equipment.root;
    object.lastReading = [{x: [], y: []}];
    object.pulses = 0;
    object.lastFlowRateTimer = 0;
    object.lastFlowPinState = false;
    object.template = equipment;
    object.maxval = confs["maxval"];
    object.lastval = 0;

    object.location = equipment.location;
    object.equipment = equipment.equipment;

    object.toggleConnect = function (updated){
        object.connected = updated.connected;
    };

    object.toggleEnable = function (updated){
        object.toggleConnect(updated);
    };

    board.digitalRead(confs["pin"], function(value) {
        // send the pin status to flowSignal helper
        flowSignal(value, object);
    });

    console.log('Flow sockets on connection');

    setInterval(function () {
        var litres = object.pulses;
        litres /= 7.5;
        litres /= 60;
        object.lastReading = {x: getDateString(), y: litres};
        console.log('Changed' + " -->  Flow: " +  object.lastReading.y + "l [" + object.lastReading.x + "]");

        if (litres == object.lastval) return;

        bindAlarm(object);

        object.lastval = litres;

        if (socket) socket.emit('flowData', object.lastReading.y + "l" );

    }, confs["loop"]);

    if (socket) socket.emit('flowData', 'On');

    return object;
  };
  function startHygrometer(equipment, socket) {
    console.log('Starting Hygrometer');
    let confs = {};
    for (let conf of equipment.data.configurations){
      confs[conf.attribute] = conf.value;
    }
    let object = new five.Sensor({
        pin: confs["pin"],
        freq: confs["loop"],
        threshold: confs["threshold"],
        id: equipment._id
    });
    object.label = equipment.label;
    object.type = equipment.type;
    object.category = equipment.category;
    object.enabled= equipment.enabled
    object.connected = equipment.connected;
    object.key = equipment.key;
    object.lastReading = -1;
    object.quantity = 0;
    object.loops = 0;
    object.value = 0;
    object.template = equipment;
    object.maxval = confs["maxval"];
    object.action = confs["action"];

    object.location = equipment.location;
    object.equipment = equipment.equipment;

    object.toggleConnect = function (updated){
        //this.connected ? false : true;
        object.connected = updated.connected;
    };

    object.toggleEnable = function (updated){
        object.toggleConnect(updated);
    };

    console.log('Hygrometer sockets on connection');

    object.on("change", function (){

      object.scaledValue = Five.Fn.toFixed(100 - object.fscaleTo(0, 100),2);
      //object.value = value;

      if (object.scaledValue == object.lastReading) return;

      object.lastReading = object.scaledValue;
      object.quantity++;
      object.average = ((object.average * (object.quantity - 1)) + object.scaledValue) / object.quantity;

      //console.log("Hygrometer");
      //console.log("  Sensor: " + object.key);
      console.log("  Humidity : " + object.scaledValue);
      //console.log("  Average: " + object.average);
      let lastUpdate = {
          date: Date.now(),
          level: "",
          nonscaled: "",
          equipment:{
            label: object.label,
            type: object.type,
            category: object.category
          },
          unit: "%",
          value: object.scaledValue,
          raw: object.value,
          loops: object.loops
      };
      publishReadings(object.scaledValue,lastUpdate, object);

      if (socket) socket.emit('hygrometerData', object.scaledValue);
    });

    if (socket) socket.emit('hygrometerData', 'On');

    return object;
  }
  function startThermometer(equipment, socket) {
    // VOUT = 1500 mV at 150°C
    // VOUT = 250 mV at 25°C
    // VOUT = –550 mV at –55°C
    // 10mV = 1°C
    console.log('Starting Thermometer');
    let confs = {};
    for (let conf of equipment.data.configurations){
      confs[conf.attribute] = conf.value;
    };
    console.log(confs);
    let object = new five.Thermometer({
        controller: confs["controller"],
        pin: confs["pin"],
        freq: confs["loop"],
        id: equipment._id,
        toCelsius: function(raw) {
            if (confs["controller"] === "ANALOGIC")
              return Math.round((raw * 180 ) / 1024) - 55;
            else
              return Math.round(( raw * 100 ) / 1024);
        }
    });
    object.label = equipment.label;
    object.type = equipment.type;
    object.category = equipment.category;
    object.enabled = equipment.enabled;
    object.connected = equipment.connected;
    object.root = equipment.root;
    object.lastReading = 0;
    object.location = equipment.location;
    object.equipment = equipment.equipment;

    object.toggleConnect = function (updated){
        //this.connected ? false : true;
        object.connected = updated.connected;
    };

    object.toggleEnable = function (updated){
        object.toggleConnect(updated);
    };


    console.log('Thermometer sockets on connection');
    object.on("change", function(data) {

        let celsius = Math.round(this.C);

        if (celsius == object.lastReading) return;

        object.lastReading = celsius;

        //console.log("Sensor: " + object.key);
        console.log("Temp: " + celsius);

        let lastUpdate = {
            date: Date.now(),
            level: "",
            nonscaled: "",
            equipment:{
              label: object.label,
              type: object.type,
              category: object.category
            },
            unit: "°C",
            value: celsius,
            raw: {
                celsius: this.C,
                fahrenheit: this.F,
                kelvin: this.K
            },
            loops: 0
        };
        publishReadings(celsius, lastUpdate, object);

        if (socket) socket.emit('thermometerData', object.scaledValue);
    });

    if (socket) socket.emit('thermometerData', 'On');

    return object;
  }
  function startLight(equipment, socket) {
    console.log('Starting Light');
    let confs = {};
    for (let conf of equipment.data.configurations){
      confs[conf.attribute] = conf.value;
    }
    let object = new five.Light({
        pin: confs["pin"],
        freq: confs["freq"],
        threshold: confs["threshold"],
        id: equipment._id
    });
    object.label = equipment.label;
    object.type = equipment.type;
    object.category = equipment.category;
    object.enabled = equipment.enabled;
    object.connected = equipment.connected;
    object.location = equipment.location;
    object.equipment = equipment.equipment;
    object.root = equipment.root;
    object.lastReading = 0;

    console.log("    object.connected: ",     object.connected);
    console.log("    equipment.connected: ",     equipment.connected);

    object.toggleConnect = function (updated){
        //this.connected ? false : true;
        object.connected = updated.connected;
    };
/*
    object.toggleEnable = function (updated){
        object.toggleConnect(updated);
    };*/

    console.log('Light sockets on connection');
    object.on("change", function() {

      if (object.level == object.lastReading ) return;

      object.lastReading = object.level;
      object.percentage = Math.round(100 - (object.level * 100));

      let lastUpdate = {
          date: Date.now(),
          level: object.level,
          nonscaled: "",
          equipment:{
            label: object.label,
            type: object.type,
            category: object.category
          },
          unit: confs["unit"],
          value: object.percentage,
          raw: object.value,
          loops: 0
      };
      publishReadings(object.percentage, lastUpdate, object);
      if (socket) socket.emit('lightData', object.percentage);
    });

    if (socket) socket.emit('lightData', 'On');

    return object;
  }
  function startRelay(equipment, socket) {
    console.log('Starting Relay');
    let confs = {};
    for (let conf of equipment.data.configurations){
      confs[conf.attribute] = conf.value;
    }

    let object = new five.Relay({
      pin: confs["pin"],
      type: confs["type"],
      id: equipment._id
    });
    object.label = equipment.label;
    object.type = equipment.type;
    object.category = equipment.category;
    object.enabled = equipment.enabled;
    object.connected = equipment.connected;
    object.location = equipment.location;
    object.equipment = equipment.equipment;
    object[this.isOn ? "off" : "on"]();

    object.toggleConnect = function(updatedItem) {
        //this.connected ? false : true;
        object.connected = updatedItem.connected;
        object[object.isOn ? "off" : "on"]();
        console.log("Toggle");

        if (this.isOn) {
            console.log("Relé ligado");
        } else {
            console.log("Relé desligado");
        }

        let lastUpdate = {
            date: Date.now(),
            equipment:{
              label: object.label,
              type: object.type,
              category: object.category
            },
            value: object.isOn
        };
        publishReadings(object.isOn, lastUpdate, object);
    }

    object.toggleEnable = function (updated) {
        object.toggleConnect(updated)
    };

    return object;
  }
  function startLed(equipment, socket) {
    console.log('Starting Led');
    let confs = {};
    for (let conf of equipment.data.configurations){
      confs[conf.attribute] = conf.value;
    }

    let object = new five.Led({
        pin: confs["pin"],
        id: equipment._id
    });
    object.label = equipment.label;
    object.type = equipment.type;
    object.category = equipment.category;
    object.enabled = equipment.enabled;
    object.connected = equipment.connected;
    object.location = equipment.location;
    object.equipment = equipment.equipment;
    object.loop = confs["loop"];
    object.ledStyle = confs["ledStyle"];
    object.duration = confs["duration"];

    object.toggleConnect = function(updatedItem) {
      if (updatedItem.connected) object.on();
      else object.stop().off();
      object.connected = updatedItem.connected;
      console.log("led: "+ this.isOn);

      if (object.isOn) {
            if (object.ledStyle == 0)
                object.blink(object.loop);
            else if (object.ledStyle == 1) {
                object.pulse({
                    easing: "linear",
                    duration: object.duration,
                    cuePoints: [0, 0.2, 0.4, 0.6, 0.8, 1],
                    keyFrames: [0, 10, 0, 50, 0, 255],
                    onstop: function () {
                        console.log("Animation stopped");
                    }
                });
                this.wait(object.loop, function () {

                    // stop() terminates the interval
                    // off() shuts the led off
                    object.stop().off();
                });
            }
            else if (object.ledStyle == 2) {
                object.fadeIn();

                // Toggle the led after 5 seconds (shown in ms)
                this.wait(object.loop, function () {
                    object.fadeOut();
                });
            }

            let lastUpdate = {
                date: Date.now(),
                equipment:{
                  label: object.label,
                  type: object.type,
                  category: object.category
                },
                value: object.isOn
            };
            publishReadings(object.isOn, lastUpdate, object);
      };
    }

    object.toggleEnable = function (updatedItem) {
        object.toggleConnect(updatedItem);
    };

    return object;
  };

  //------ helper function
  function publishReadings(updatedValue, reading, object){
    if (!reading) console.log({ data: reading, code: 422, messageKeys: ['not-found'] });
    //console.log(reading);
    let newVal = new Messenger({ root: object.id, location: object.location, type: 'reading', category: 'message' , data: reading });
    //console.log(newVal);
    newVal.relations.ownedBy.push({
      id: mongoose.Types.ObjectId(object.root)
    });
    newVal.relations.connectedTo.push({
      id: mongoose.Types.ObjectId(object.id)
    });
    Messenger.create(newVal)
      .then(data => {
        console.log("Leitura atualizada:  ", data._id);
      })
      .catch(err => {
        console.log('Readings Synchronization failed:', err);
      });
    Knowledge.update({"_id": mongoose.Types.ObjectId(object.id)}, {$set: {"data.updatedValue": updatedValue}})
      .then(data => {
        console.log("Updated Value atualizado:  ", updatedValue);
      })
      .catch(err => {
        console.log('Readings Synchronization failed:', err);
      });
  };
  //-- keep track of pulses
  function flowSignal(value, object) {
      if (value === 0) {
          object.lastFlowRateTimer ++;
          return;
      }
      if (value === 1) {
          object.pulses ++;
      }
      object.lastFlowPinState = value;
      object.flowrate = object.flowrate;
      object.flowrate /= object.lastFlowRateTimer;
      object.lastFlowRateTimer = 0;
  };
  function bindAlarm(object) {
      let updatedValue = parseFloat(Math.round(object.lastReading.y * 100) / 100).toFixed(2);
      let lastUpdate = {
          date: object.lastReading.x,
          level: "",
          nonscaled: "",
          equipment:{
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

module.exports = getEquipmentDecorateIO;
