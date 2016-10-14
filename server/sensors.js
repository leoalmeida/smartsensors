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

module.exports = (httpServer) => {

    let sensors = [], alerts = [], sensor, sensorPower;

    let refSensors = db.ref('sensors/public/' + userKey + "/" + locationID);

    let refAlerts = db.ref('alerts/public/');
    refAlerts.once("value", function (snapshot) {
        alerts = snapshot.val() ;
    });

    const io = require('socket.io')(httpServer);

    const five = require("johnny-five");
    const board = new five.Board();
    let messages = [];

    //Arduino board connection
    board.on("ready", () => {
        let loops = 0;

        messages.push("Arduino Connected");
        console.log('Arduino connected');

        refSensors.on("child_added", function (snapshot) {
            var item = snapshot.val();
            if (item.enabled) {
            sensors.push(item);

            console.log('Encontrei o sensor [' + item.name + '] conectado!!');

            for (var i=0; i < sensors.length; i++){

                if (!sensors[i].enabled) continue;

                    if (!alerts) alerts = [];

                    alerts[sensors[i].key] = {
                        active: true,
                        enabled: true,
                        severity: "white",
                        lastUpdate: {
                            value: sensors[i].label
                        },
                        configurations: {
                            col: 1,
                            row: 1,
                            draggable: false,
                            icon: sensors[i].icon,
                            label: sensors[i].label,
                            localization: {image: "chuvaforte.jpg"},
                            pin: {color: "blue"},
                            sensors: [sensors[i].label],
                            type: sensors[i].type,
                            name: sensors[i].name,
                            owner: userKey,

                        }
                    };

                    console.log("Conectando sensor [" + sensors[i].type + "]");

                    if (sensors[i].type == "motion"){
                        var motion = startMotion(sensors[i]);
                    }
                    else if (sensors[i].type == "led") {
                        var led = startLed(sensors[i]);
                    }
                    else if (sensors[i].type == "moisture") {
                        var moisture = startMoisture(sensors[i]);
                    }
                    else if (sensors[i].type == "sensor") {
                        var sensor = startSensor(sensors[i]);
                    }
                    else if (sensors[i].type == "thermometer") {
                        var temperature = startThermometer(sensors[i]);
                    }
                };
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

    let startMotion = function (sensor) {
        var motion = new five.Motion(sensor.configurations.pin);
        motion.active = true;
        motion.key = sensor.key;
        // console.log("Size: " + sensor.configurations.events.length);

        /*for (var i=0; i< sensor.configurations.events.length; i++){
            console.log("Size: " + sensor.configurations.events[i]);
            motion.on(sensor.configurations.events[i], function (data) {
                console.log("This:"+this, Date.now());
                console.log("Value:"+data.value, Date.now());
                console.log("DetectedMotion:"+data.detectedMotion, Date.now());
                console.log("iIsCalibrated:"+data.isCalibrated, Date.now());
            });
        }*/

         motion.on("calibrated", function () {
            console.log("Sensor Calibrated", Date.now());
         });

         motion.on("motionstart", function () {
            console.log("motion started", Date.now());
         });

         motion.on("motionend", function () {
            console.log("motion ended", Date.now());
         });

         motion.on("data", function (data) {

             if (data.detectedMotion == motion.lastReading) return;

             motion.lastReading = data.detectedMotion;
             console.log("leitura:" + data);

             alerts[motion.key].lastUpdate.data = data;

             messages.push("The reading value has changed.");
             console.log("The reading value has changed.");

             if (data.detectedMotion) {
                 motion.alert = true;
                 alerts[motion.key].active = true;
                 alerts[motion.key].severity = "red";
                 alerts[motion.key].startDate = Date.now();
                 updateAlert("public", motion.key, alerts[motion.key]);
             } else {
                 motion.alert = false;
                 alerts[motion.key].active = false;
                 alerts[motion.key].severity = "white";
                 alerts[motion.key].releaseDate = Date.now();
                 removeAlert("public", motion.key);
             }
             updateReadings(alerts[motion.key].lastUpdate, motion.key);
         });
        return motion;
    };
    let startLed = function (sensor) {
        var led = new five.Led(sensor.configurations.pin);

        if (sensor.style == 0)
            led.blink(sensor.configurations.loop);
        else if (sensor.style == 1) {
            led.pulse({
                easing: "linear",
                duration: sensor.configurations.duration,
                cuePoints: [0, 0.2, 0.4, 0.6, 0.8, 1],
                keyFrames: [0, 10, 0, 50, 0, 255],
                onstop: function () {
                    console.log("Animation stopped");
                }
            });
            this.wait(sensor.configurations.loop, function () {

                // stop() terminates the interval
                // off() shuts the led off
                led.stop().off();
            });
        }
        else if (sensor.style == 2) {
            led.fadeIn();

            // Toggle the led after 5 seconds (shown in ms)
            this.wait(sensor.configurations.loop, function () {
                led.fadeOut();
            });
        }

        this.repl.inject({
            // Allow limited on/off control access to the
            // Led instance from the REPL.
            on: function () {
                led.on();
            },
            off: function () {
                led.off();
            }
        });
        return led;
    };
    let startMoisture = function (sensor) {
        if (sensor.configurations.analogic)
            analogicSensor = new five.Sensor(
                sensor.configurations.pin,
                sensor.configurations.threshold
            );

        if (sensor.configurations.digital)
            digitalSensor = new five.Pin(sensor.configurations.pin);

        sensor.on("data", () => {
            if (sensorPower.isHigh){
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
            changedReading.average = ((changedReading.average * (changedReading.quantity - 1)) + changedReading.value) / changedReading.quantity;
            console.log("Average: " + changedReading.average);
            // moisture.date =

            messages.push("The reading value has changed.");
            console.log("The reading value has changed.");

            alerts[sensor.$key].lastUpdate = {
                loops: loops,
                unit: "%",
                value: changedReading.value
            };

            if (changedReading.value > moisture.configurations.max) {
                moisture.alert = true;
                alert.severity = "red";
                updateAlert("public", moisture.key, alerts[moisture.key]);
            } else if (changedReading.value < moisture.configurations.max) {
                moisture.alert = true;
                alert.severity = "blue";
                updateAlert("public", moisture.key, alerts[moisture.key]);
            } else if (moisture.alert == true) {
                moisture.alert = false;
                alert.severity = "white";
                alert.releaseDate = "11/06/2016 15:15"
                removeAlert("public", moisture.key);
            }

            updateReadings(changedReading, key);
        });


        board.loop(moisture.configurations.loop, function () {
            if (!sensorPower.isHigh) {
                sensorPower.high();
                sensor.enable();
            }
        });
        return value;
    };
    let startThermometer = function (sensor) {

        var temperature = new five.Thermometer({
            controller: sensor.configurations.controller,
            freq : sensor.configurations.loop,
            threshold : sensor.configurations.threshold,
            pin: sensor.configurations.pin,
            toCelsius: function(raw) { // optional
                return (raw * sensor.configurations.sensivity) + sensor.configurations.offset;
            }
        });
        temperature.active = true;
        temperature.key = sensor.key;
        // console.log("Size: " + sensor.configurations.events.length);


        temperature.on("data", function() {
            if (this.C == temperature.lastReading) return;

            temperature.lastReading = this.C;

            console.log("celsius: %d", this.C);
            console.log("fahrenheit: %d", this.F);
            console.log("kelvin: %d", this.K);

            alerts[temperature.key].lastUpdate.data = {
                celsius: this.C,
                fahrenheit: this.F,
                kelvin: this.K
            };

            messages.push("The reading value has changed.");
            console.log("The reading value has changed.");

            if (this.C > 35) {
                temperature.alert = true;
                alerts[temperature.key].active = true;
                alerts[temperature.key].severity = "red";
                alerts[temperature.key].startDate = Date.now();
                updateAlert("public", temperature.key, alerts[temperature.key]);
            } else if (this.C < 10) {
                temperature.alert = true;
                alerts[temperature.key].active = true;
                alerts[temperature.key].severity = "yellow";
                alerts[temperature.key].startDate = Date.now();
                updateAlert("public", temperature.key, alerts[temperature.key]);
            } else {
                temperature.alert = false;
                alerts[temperature.key].active = false;
                alerts[temperature.key].severity = "green";
                alerts[temperature.key].releaseDate = Date.now();
                removeAlert("public", temperature.key);
            }
            updateReadings(alerts[temperature.key].lastUpdate, temperature.key);

        });

        return temperature;
    };
    let startSensor = function (sensor) {
        var pin = "A0";

        var anySensor = new five.Sensor({
            pin: sensor.configurations.pin,
            freq: sensor.configurations.loop,
            threshold: sensor.configurations.threshold
        });
        anySensor.active = true;
        anySensor.key = sensor.key;
        // console.log("Size: " + sensor.configurations.events.length);

        // Scale the sensor's data from 0-1023 to 0-10 and log changes
        anySensor.on("change", function() {
            this.scaledReadingValue = this.scaleTo(0, 100);

            if (this.scaledReadingValue == anySensor.lastReading) return;

            alerts[anySensor.key].lastUpdate.data = this;
            alerts[anySensor.key].lastReading = this.scaledReadingValue;

            messages.push("The reading value has changed.");
            console.log("The reading value has changed.");

            console.log("New reading: " + this.scaledReadingValue );

            if (this.scaledReadingValue > 70) {
                anySensor.alert = true;
                alerts[anySensor.key].active = true;
                alerts[anySensor.key].severity = "red";
                alerts[anySensor.key].startDate = Date.now();
                updateAlert("public", anySensor.key, alerts[anySensor.key]);
            } else if (this.scaledReadingValue < 30) {
                anySensor.alert = true;
                alerts[anySensor.key].active = true;
                alerts[anySensor.key].severity = "yellow";
                alerts[anySensor.key].startDate = Date.now();
                updateAlert("public", anySensor.key, alerts[anySensor.key]);
            } else {
                anySensor.alert = false;
                alerts[anySensor.key].active = false;
                alerts[anySensor.key].severity = "green";
                alerts[anySensor.key].releaseDate = Date.now();
                removeAlert("public", anySensor.key);
            }
            updateReadings(alerts[anySensor.key].lastUpdate, anySensor.key);

        });

        return temperature;
    };

};

let updateAlert = function (accessType, key ,alert) {
    firebase.database().ref('alerts/' + accessType + '/' + key).set(alert)
    console.log("updated  " + 'alerts/' + accessType + '/'+ key);
};

let removeAlert = function (accessType, key) {
    firebase.database().ref('alerts/' + accessType + '/'+ key).remove();
    console.log("removed  " + 'alerts/' + accessType + '/'+ key);
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
