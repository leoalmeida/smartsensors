var firebase = require("firebase");
firebase.initializeApp({
    apiKey: 'AIzaSyCCO7zMiZZTav3eDQlD6JnVoEcEVXkodns',
    authDomain: 'guifragmentos.firebaseapp.com',
    databaseURL: 'https://guifragmentos.firebaseio.com',
    storageBucket: 'guifragmentos.appspot.com',
});

let locationID = "JwyqVEHujYe3RtBCN50gbjXK1EB3";
let db = firebase.database();

module.exports = (httpServer) =>
{

    let sensors, alerts, sensor, sensorPower;

    let refSensors = db.ref('sensors/public/' + locationID);
    refSensors.once("value", function (snapshot) {
        console.log(snapshot.val());
        sensors = snapshot.val();
        for (var i=0; i < sensors.length; i++) {
            console.log(sensors[i].$key);
        }
    });

    let refAlerts = db.ref('sensors/public/' + locationID);
    refAlerts.once("value", function (snapshot) {
        console.log(snapshot.val());
        alerts = snapshot.val();
        for (var i=0; i < alerts.length; i++) {
            console.log(alerts[i].$key);
        }
    });

    const io = require('socket.io')(httpServer);

    const five = require("johnny-five");
    const board = new five.Board();

    //Arduino board connection
    board.on("ready", () => {
        let messages = [];
        let loops = 0;

        messages.push("Arduino Connected");
        console.log('Arduino connected');

        for (var i=0; i < sensors.length; i++){

            if (!sensors[i].enabled) continue;

            sensor = new five.Sensor(sensors[i].configurations.analogic);
            sensorPower = new five.Pin(sensors[i].configurations.digital);

            sensor.on("data", () => {
                if (sensorPower.isHigh) {
                  let value = sensor.scaleTo(0, 100);
                  loops++;
                  // this.storedb(actualReading);

                  messages.push("Moisture: " + value);
                  // console.log("Moisture: " + value);

                  sensorPower.low();
                  sensor.disable();
                }
            });

            sensor.on("change", () => {
                let actualReading, changedReading;
                changedReading.value = sensor.scaleTo(0, 100);
                console.log("Average: " + changedReading.value);
                changedReading.quantity++;
                changedReading.loops = loops;
                changedReading.average = ((changedReading.average * (changedReading.quantity - 1)) + changedReading.value)/ changedReading.quantity;
                console.log("Average: " + changedReading.average );
                // moisture.date =

                messages.push("The reading value has changed.");
                console.log("The reading value has changed.");

                alerts[sensors[i].$key].lastUpdate = {
                  loops: loops,
                  unit: "%",
                  value: changedReading.value
                };

                if (changedReading.value > moisture.configurations.max) {
                moisture.alert = true;
                alert.severity = "red";
                updateAlert(alert, key);
                }else if (changedReading.value < moisture.configurations.max) {
                moisture.alert = true;
                alert.severity = "blue";
                updateAlert(alert, key);
                }else if(moisture.alert == true){
                moisture.alert = false;
                alert.severity = "white";
                alert.releaseDate = "11/06/2016 15:15"
                removeAlert(key);
                }

                updateReadings(changedReading, key);
            });


            board.loop(moisture.configurations.loop, function(){
                if (!sensorPower.isHigh) {
                  sensorPower.high();
                  sensor.enable();
                }
            });
        }
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


let updateReadings = function (reading, key) {
    console.log("updating  " + key);
    let sessionsRef = firebase.database().ref('readings/'+ key);
    sessionsRef.update(reading);
    console.log("updated  " + key);
};



/*let moisture = {
 icon: "motion.svg",
 enabled: true,
 alert: true,
 label: "S0",
 name: "Moisture",
 type: "moisture",
 readings: {
 loops: 0,
 average: 0,
 date: "initial",
 quantity: 0,
 unit: "%",
 value: 0
 },
 configurations: {
 model: "YL-96",
 analogic: { pin: "A0", freq: 5000, threshold: 5 },
 digital: { pin: "D13" },
 loop: 1000,
 min: 65,
 max: 70,
 unit: "%"
 }
 };

 let alert = {
 isActive: true,
 lastUpdate: {
 loops: 0,
 unit: "%",
 value: 0
 },
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
 name: "Humidade da terra",
 pin: {
 color: "blue"
 },
 draggable: false,
 icon: "motion.svg",
 label: "A0",
 type: "moisture",
 col: 1,
 row: 1
 },
 releaseDate : "",
 routeLink : "/sensors/moisture",
 sensors : ["S0"],
 severity : "grey",
 startDate : "10/06/2016 10:15"
 }*/