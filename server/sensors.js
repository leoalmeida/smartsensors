var firebase = require("firebase");
firebase.initializeApp({
    apiKey: 'AIzaSyCCO7zMiZZTav3eDQlD6JnVoEcEVXkodns',
    authDomain: 'guifragmentos.firebaseapp.com',
    databaseURL: 'https://guifragmentos.firebaseio.com',
    storageBucket: 'guifragmentos.appspot.com',
});

let userKey = "JwyqVEHujYe3RtBCN50gbjXK1EB3";
let locationID = "Casa"
let db = firebase.database();

module.exports = (httpServer) =>
{

    let sensors = [], alerts, sensor, sensorPower;

    let refSensors = db.ref('sensors/public/' + userKey + "/" + locationID);
    refSensors.on("child_added", function (snapshot) {
        var item = snapshot.val();
        console.log(item.enabled);
        if (item.enabled) {
            sensors.push(item);
        }
        console.log(sensors.length);
        /*
        for (var i=0; i < snapshot.val().length; i++) {
            console.log("fired");
            sensors.push(snapshot.val()[i]);
        }
        */
    });

    let refAlerts = db.ref('alerts/public/' + userKey);
    refAlerts.once("value", function (snapshot) {
        alerts = snapshot.val();
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

            console.log(sensors[i]);

            if (sensors[i].type == led) {
                var led = new five.Led(sensors[i].configurations.digital.pin);

                if (sensors[i].style == 0)
                    led.blink(sensors[i].configurations.loop);
                else if (sensors[i].style == 1) {
                    led.pulse({
                        easing: "linear",
                        duration: sensors[i].configurations.duration,
                        cuePoints: [0, 0.2, 0.4, 0.6, 0.8, 1],
                        keyFrames: [0, 10, 0, 50, 0, 255],
                        onstop: function() {
                            console.log("Animation stopped");
                        }
                    });
                    this.wait(sensors[i].configurations.loop, function() {

                        // stop() terminates the interval
                        // off() shuts the led off
                        led.stop().off();
                    });
                }
                else if (sensors[i].syle == 2) {
                    led.fadeIn();

                    // Toggle the led after 5 seconds (shown in ms)
                    this.wait(sensors[i].configurations.loop, function() {
                        led.fadeOut();
                    });
                }

                this.repl.inject({
                    // Allow limited on/off control access to the
                    // Led instance from the REPL.
                    on: function() {
                        led.on();
                    },
                    off: function() {
                        led.off();
                    }
                });
                continue;
            }

            if (sensors[i].configurations.analogic)
                analogicSensor = new five.Sensor(sensors[i].configurations.analogic);

            if (sensors[i].configurations.digital)
                digitalSensor = new five.Pin(sensors[i].configurations.digital);

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