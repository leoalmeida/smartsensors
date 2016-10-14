// node-webkit
let NW = require('nw.gui');

nw.require("nwjs-j5-fix").fix();

let firebase = require("firebase");
firebase.initializeApp({
    apiKey: 'AIzaSyCCO7zMiZZTav3eDQlD6JnVoEcEVXkodns',
    authDomain: 'guifragmentos.firebaseapp.com',
    databaseURL: 'https://guifragmentos.firebaseio.com',
    storageBucket: 'guifragmentos.appspot.com',
});

let userKey = "JwyqVEHujYe3RtBCN50gbjXK1EB3";
let serverID = "Casa";
// let userKey = serverID = "";
let sensors = [], alerts = [], sensor, sensorPower;
const db = firebase.database();
const five = require("johnny-five");
let board = new five.Board();


// const io = require('socket.io')(httpServer);

const refAlerts = db.ref('alerts/public/');

refAlerts.once("value", function (snapshot) {
    alerts = snapshot.val() ;
});

let $ = function (selector) {
    return document.querySelector(selector);
};

document.addEventListener("DOMContentLoaded", function() {

    let userKeyCmp = $("#userKey");
    userKeyCmp.value = userKey;
    let serverIDCmp = $("#serverID");
    serverIDCmp.value = serverID;

    $('#btnClose').addEventListener('click', function (event) {
        window.close();
    });

    $('#btnClear').addEventListener('click', function (event) {
        let logElement = $("#output");
        logElement.innerHTML = "";
        logElement.scrollTop = logElement.scrollHeight;
    });

    $('#btnStart').addEventListener('click', function (event) {
        let userKey = userKeyCmp.value;
        let serverID = serverIDCmp.value;

        if (!userKey) {
            writeLog("Obrigatório escolher uma key");
            return;
        }

        if (!serverID) {
            writeLog("Obrigatório escolher um server ID");
            return;
        }

        let querySensor = 'sensors/public/' + userKey + "/" + serverID;
        const refSensors = db.ref(querySensor);

        writeLog("Sensor Chamado");

        refSensors.on("child_added", function (snapshot){
            writeLog("Received");
            writeLog(JSON.stringify(snapshot.val()));
        });

        //Arduino board connection
        board.on("ready", () => {
            let loops = 0;

            writeLog("Arduino Connected");
            writeLog('Arduino connected');

            let motion, led, moisture, sensor, temperature;

            refSensors.on("child_added", function (snapshot) {
                writeLog("child_added");
                let item = snapshot.val();
                if (item.enabled) {
                    sensors.push(item);

                    writeLog('Encontrei o sensor [' + item.name + '] conectado!!');

                    for (let i = 0; i < sensors.length; i++) {

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

                        writeLog("Conectando sensor [" + sensors[i].type + "]");

                        if (sensors[i].type == "motion") {
                            board.repl.inject({motion: startMotion(sensors[i])});
                        }
                        else if (sensors[i].type == "led") {
                            board.repl.inject({led: startLed(sensors[i])});
                        }
                        else if (sensors[i].type == "moisture") {
                            board.repl.inject({moisture: startMoisture(sensors[i])});
                        }
                        else if (sensors[i].type == "sensor") {
                            board.repl.inject({sensor: startSensor(sensors[i])});
                        }
                        else if (sensors[i].type == "thermometer") {
                            board.repl.inject({temperature: startThermometer(sensors[i])});
                        }
                    };
                }
            });

        });
    });

    $('#simple-notifier').addEventListener('click', function (event) {
        showNotification('./img/icons/ic_add_24px.svg', "Taxi is arrived", 'hurry up');
    });

    $('#node-notifier').addEventListener('click', function (event) {
        showNativeNotification(false, "Testing HTML Notify", 'hurry up', false, './img/icons/ic_add_24px.svg');
    });

    // bring window to front when open via terminal
    NW.Window.get().focus();

    // for nw-notify frameless windows
    NW.Window.get().on('close', function() {
        NW.App.quit();
    });

});
let startMotion = function (sensor) {
    let motion = new five.Motion(sensor.configurations.pin);
    motion.active = true;
    motion.key = sensor.key;
    // writeLog("Size: " + sensor.configurations.events.length);

    /*for (let i=0; i< sensor.configurations.events.length; i++){
     writeLog("Size: " + sensor.configurations.events[i]);
     motion.on(sensor.configurations.events[i], function (data) {
     writeLog("This:"+this, Date.now());
     writeLog("Value:"+data.value, Date.now());
     writeLog("DetectedMotion:"+data.detectedMotion, Date.now());
     writeLog("iIsCalibrated:"+data.isCalibrated, Date.now());
     });
     }*/

    motion.on("calibrated", function () {
        writeLog("Sensor Calibrated", Date.now());
    });

    motion.on("motionstart", function () {
        writeLog("motion started", Date.now());
    });

    motion.on("motionend", function () {
        writeLog("motion ended", Date.now());
    });

    motion.on("data", function (data) {

        if (data.detectedMotion == motion.lastReading) return;

        motion.lastReading = data.detectedMotion;
        writeLog("leitura:" + data);

        alerts[motion.key].lastUpdate.data = data;

        writeLog("The reading value has changed.");

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
    let led = new five.Led(sensor.configurations.pin);

    if (sensor.style == 0)
        led.blink(sensor.configurations.loop);
    else if (sensor.style == 1) {
        led.pulse({
            easing: "linear",
            duration: sensor.configurations.duration,
            cuePoints: [0, 0.2, 0.4, 0.6, 0.8, 1],
            keyFrames: [0, 10, 0, 50, 0, 255],
            onstop: function () {
                writeLog("Animation stopped");
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

            writeLog("Moisture: " + value);
            // writeLog("Moisture: " + value);

            sensorPower.low();
            sensor.disable();
        }
    });
    sensor.on("change", () => {
        let actualReading, changedReading;
        changedReading.value = sensor.scaleTo(0, 100);
        writeLog("Average: " + changedReading.value);
        changedReading.quantity++;
        changedReading.loops = loops;
        changedReading.average = ((changedReading.average * (changedReading.quantity - 1)) + changedReading.value) / changedReading.quantity;
        writeLog("Average: " + changedReading.average);
        // moisture.date =

        writeLog("The reading value has changed.");
        writeLog("The reading value has changed.");

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

    let temperature = new five.Thermometer({
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
    // writeLog("Size: " + sensor.configurations.events.length);


    temperature.on("data", function() {
        if (this.C == temperature.lastReading) return;

        temperature.lastReading = this.C;

        writeLog("celsius: %d", this.C);
        writeLog("fahrenheit: %d", this.F);
        writeLog("kelvin: %d", this.K);

        alerts[temperature.key].lastUpdate.data = {
            celsius: this.C,
            fahrenheit: this.F,
            kelvin: this.K
        };

        writeLog("The reading value has changed.");
        writeLog("The reading value has changed.");

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
    let pin = "A0";

    let anySensor = new five.Sensor({
        pin: sensor.configurations.pin,
        freq: sensor.configurations.loop,
        threshold: sensor.configurations.threshold
    });
    anySensor.active = true;
    anySensor.key = sensor.key;
    // writeLog("Size: " + sensor.configurations.events.length);

    // Scale the sensor's data from 0-1023 to 0-10 and log changes
    anySensor.on("change", function() {
        this.scaledReadingValue = this.scaleTo(0, 100);

        if (this.scaledReadingValue == anySensor.lastReading) return;

        alerts[anySensor.key].lastUpdate.data = this;
        alerts[anySensor.key].lastReading = this.scaledReadingValue;

        writeLog("The reading value has changed.");
        writeLog("The reading value has changed.");

        writeLog("New reading: " + this.scaledReadingValue );

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

let updateAlert = function (accessType, key ,alert) {
    firebase.database().ref('alerts/' + accessType + '/' + key).set(alert)
    writeLog("updated  " + 'alerts/' + accessType + '/'+ key);
};

let removeAlert = function (accessType, key) {
    firebase.database().ref('alerts/' + accessType + '/'+ key).remove();
    writeLog("removed  " + 'alerts/' + accessType + '/'+ key);
};

let updateReadings = function (reading, key) {
    writeLog("updating  " + key);
    let sessionsRef = firebase.database().ref('readings/'+ key);
    sessionsRef.update(reading);
    writeLog("updated  " + key);
};

//Socket connection handler
/* io.on('connection', (socket) => {
 writeLog("Socket:" + socket.id);

 socket.on('moisture:on', (data) =>  {
 moisture.on();
 writeLog('Moisture ON RECEIVED');
 });
 socket.on('moisture:off', (data) =>  {
 moisture.off();
 writeLog('Moisture OFF RECEIVED');
 });
 });*/
// writeLog('Waiting for connection');

let writeLog = function (msg) {
    var logElement = $("#output");
    logElement.innerHTML += msg + "<br>";
    logElement.scrollTop = logElement.scrollHeight;
};

// NW.JS Notification
let showNotification = function (icon, title, body) {
    if (icon && icon.match(/^\./)) {
        icon = icon.replace('.', 'file://' + process.cwd());
    }

    let notification = new Notification(title, {icon: icon, body: body});

    notification.onclick = function () {
        writeLog("Notification clicked");
    };

    notification.onclose = function () {
        writeLog("Notification closed");
        NW.Window.get().focus();
    };

    notification.onshow = function () {
        writeLog("-----<br>" + title);
    };

    return notification;
}

// NODE-NOTIFIER
let showNativeNotification = function (icon, title, message, sound, image) {
    let notifier;
    try {
        notifier = require('node-notifier');
    } catch (error) {
        console.error(error);
        if (error.message == "Cannot find module 'node-notifier'") {
            window.alert("Can not load module 'node-notifier'.\nPlease run 'npm install'");
        }
        return false;
    }

    let path = require('path');

    icon = icon ? path.join(process.cwd(), icon) : undefined;
    image = image ? path.join(process.cwd(), image) : undefined;

    notifier.notify({
        title: title,
        message: message,
        icon: icon,
        appIcon: icon,
        contentImage: image,
        sound: sound,
        wait: false,
        sender: 'org.nwjs.sample.notifications'
    }, function (err, response) {
        if (response == "Activate\n") {
            writeLog("node-notifier: notification clicked");
            NW.Window.get().focus();
        }
    });

    writeLog("-----<br>node-notifier: " + title);
};
