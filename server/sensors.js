let firebase = require("firebase");
firebase.initializeApp({
    apiKey: 'AIzaSyCCO7zMiZZTav3eDQlD6JnVoEcEVXkodns',
    authDomain: 'guifragmentos.firebaseapp.com',
    databaseURL: 'https://guifragmentos.firebaseio.com',
    storageBucket: 'guifragmentos.appspot.com',
});

module.exports = (httpServer) => {
  let sensor, sensorPower;
  let moisture = {
    icon: "motion.svg",
    enabled: true,
    alert: true,
    label: "P0",
    name: "Moisture",
    type: "moisture",
    readings: {
          average: 0,
          date: "initial",
          quantity: 0,
          unit: "%",
          value: 0
    },
    configurations: {
        model: "YL-96",
        analogic: { pin: "A0", threshold: 5 },
        digital: { pin: "D13" },
        loop: 1000,
        min: 65,
        max: 85,
        unit: "%"
      }
  };

  let alert = {
    isActive: true,
    lastUpdates: [],
    localization: {
        address: "Rua Ray Wesley Herrick 1501, Casa 251",
        image: "chuvaforte.jpg",
        latitude: -22.0161282,
        longitude: -47.9137721
    },
    moreInfo: [{
        teste: "teste"
    }],
    configurations: {
        name: "Humidade elevada",
        pin: {
            color: "blue"
        },
        draggable: false,
        icon: "motion.svg",
        label: "P0",
        type: "moisture",
        col: 1,
        row: 1
    },
    releaseDate : "",
    routeLink : "/sensors/moisture",
    sensors : [],
    severity : "black",
    startDate : "10/06/2016 10:15"
  }

  const io = require('socket.io')(httpServer);
  const five = require("johnny-five");
  const board = new five.Board();

  //Arduino board connection
  board.on("ready", () => {
      let messages = [];

      messages.push("Arduino Connected");
      console.log('Arduino connected');

      sensor = new five.Sensor(moisture.configurations.analogic);
      sensorPower = new five.Pin(moisture.configurations.digital);

      let key = includeSensor(moisture);

      sensor.on("data", () => {
        if (sensorPower.isHigh) {
          let value = sensor.scaleTo(0, 100);
          // this.storedb(actualReading);

          messages.push("Moisture: " + value);
          console.log("Moisture: " + value);

          sensorPower.low();
          sensor.disable();
        }
      });

      sensor.on("change", () => {
          let actualReading;
          moisture.readings.value = sensor.scaleTo(0, 100);
          console.log("Average: " + moisture.readings.value);
          moisture.readings.quantity++;
          moisture.readings.average = ((moisture.readings.average * (moisture.readings.quantity - 1)) + moisture.readings.value)/ moisture.readings.quantity;
          console.log("Average: " + moisture.readings.average );
          // moisture.date =

          messages.push("The reading value has changed.");
          console.log("The reading value has changed.");
          if (moisture.readings.value > moisture.configurations.max) {
            moisture.alert = true;
            alert.severity = "red";
            updateAlert(alert, key);
          }else if (moisture.readings.value < moisture.configurations.max) {
            moisture.alert = false;
            alert.severity = "silver";
            updateAlert(alert, key);
          }else if(moisture.alert == true){
            removeAlert(key);
          }

          updateReadings(moisture.readings, key);
      });

      board.loop(moisture.configurations.loop, function(){
        if (!sensorPower.isHigh) {
          sensorPower.high();
          sensor.enable();
        }
      });

  });

  //Socket connection handler
  io.on('connection', (socket) => {
    console.log("Socket:" + socket.id);

    socket.on('moisture:on', (data) =>  {
       moisture.on();
       console.log('Moisture ON RECEIVED');
    });
    socket.on('moisture:off', (data) =>  {
        moisture.off();
        console.log('Moisture OFF RECEIVED');
    });
  });
  console.log('Waiting for connection');
};

let updateAlert = function (alert, key) {
    firebase.database().ref('alerts/' + key).set(alert)
    console.log("inserted  " + key);
};

let removeAlert = function (key) {
    firebase.database().ref('alerts/' + key).remove();
    console.log("inserted  " + key);
};

let includeSensor = function (sensor) {
    let newKey = firebase.database().ref().child('sensors').push().key;
    firebase.database().ref('sensors/' + newKey).set(sensor)
    console.log("inserted  " + newKey);
    return newKey;
};

let updateReadings = function (reading, key) {
    console.log("updating  " + key);
    let sessionsRef = firebase.database().ref('sensors/'+ key).child('readings');
    sessionsRef.update(reading);
    console.log("updated  " + key);
};
