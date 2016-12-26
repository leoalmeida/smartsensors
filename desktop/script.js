// node-webkit
let win = chrome.app.window;

//nw.require("nwjs-j5-fix").fix();

// let userKey = "JwyqVEHujYe3RtBCN50gbjXK1EB3";
// let serverID = "";
let userKey = serverID = "";
let sensors = [], sensor, sensorPower, counter;

// const io = require('socket.io')(httpServer);

let $ = function (selector) {
    return document.querySelector(selector);
};

let five,serialPortLib;

//const five = require("johnny-five");
//let board = new five.Board();
//let serialPortLib = require("browser-serialport");


let refSensors = refServerList = selectedPort = selectedServer = "";

chrome.app.runtime.onLaunched.addListener(function() {

    const userKeyCmp = $("#userKey"),
        serverIDCmp = $("#serverID"),
        btnClose = $("#btnClose"),
        btnClear = $("#btnClear"),
        btnStart = $("#btnStart"),
        btnStop = $("#btnStop"),
        btnRefresh = $("#btnRefresh"),
        serialPorts = $("#serialPorts"),
        labelPort = $("#labelPort");

    let cont=1;

    cont=1;
    userKeyCmp.addEventListener('focusout', function (event) {

        if (!userKeyCmp.value) {
            showNativeNotification('./img/ic_error_24px.svg',  "Chave Inválida", 'Insira uma nova chave, por favor.', './sounds/arpeggio.mp3', './img/ic_error_24px.svg');
            return;
        }
        refServerList = db.ref('sensors/public/'+ userKeyCmp.value);

        refServerList.once("value", function (snapshot) {
            let servers = snapshot.val();

            if (!snapshot.val()) {
                showNativeNotification('./img/ic_error_24px.svg',  "Chave Inválida", 'A Chave Inserida não existe.', './sounds/arpeggio.mp3', './img/ic_error_24px.svg');
                return;
            }
            for (server in servers) {
                let serverID = "server" + cont;
                serverIDCmp.innerHTML += "<option id='" + serverID + "'  value='" + server + "'>" + server + "</option>";
                cont++;
            }
            userKeyCmp.disabled = true;
            serverIDCmp.disabled = false;
            serialPorts.disabled = false;
        });
    });
    serverIDCmp.addEventListener('focusout', function (event) {
        if (!serialPorts.selectedIndex) btnStart.disabled = true;
        else if (!serverIDCmp.selectedIndex) { btnStart.disabled = true; return; }
        else btnStart.disabled = false;

        writeLog("Servidor selecionado: " + serverIDCmp.value);
        selectedServer = serverIDCmp.value;

    });
    serialPorts.addEventListener('focusout', function(event) {
        if (!serverIDCmp.selectedIndex) btnStart.disabled = true;
        else if (!serialPorts.selectedIndex) {btnStart.disabled = true; return;}
        else btnStart.disabled = false;

        writeLog("Porta selecionada: " + serialPorts.value);
        selectedPort = serialPorts.value;
    });
    btnClose.addEventListener('click', function (event) {
        window.close();
    });
    btnClear.addEventListener('click', function (event) {
        let logElement = $("#output");
        logElement.innerHTML = "";
        logElement.scrollTop = logElement.scrollHeight;
    });
    btnStart.addEventListener('click', function (event) {
        let userKey = userKeyCmp.value;
        let serverID = serverIDCmp.value;
        if (!userKey) { writeLog("Obrigatório escolher uma key"); return; }
        if (!serverID) { writeLog("Obrigatório escolher um server ID"); return; }

        writeLog("Buscando Sensores públicos ");
        writeLog("--> Servidor: " + serverID);
        writeLog("--> Porta: " + selectedPort);

        refSensors = db.ref('sensors/public/' + userKey + "/" + serverID);

        board = new five.Board({
            port: selectedPort
        });

        board.on("ready", () => {
            btnStart.disabled = true;
            btnStop.disabled = false;

            writeLog("Conectando Arduino!!");

            refSensors.on("child_added", function (snapshot) {
                let item = snapshot.val();
                if (item.enabled) {
                    sensors.push(item);

                    writeLog('Sensor [' + item.name + '] Encontrado!!');

                    for (let i = 0; i < sensors.length; i++) {

                        if (!alerts) alerts = [];

                        alerts[sensors[i].key] = {
                            active: true,
                            enabled: true,
                            severity: "white",
                            lastUpdate: {
                                label: sensors[i].label
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

                        writeLog("Conectando sensor [" + sensors[i].name + "]");

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
                }else{
                    writeLog("Sensor [" + item.name + "] desligado.");
                }
            });

        });
        board.on("error", function(err) {
            if (err) {
                writeLog("Erro ao conectar na porta: " + selectedPort);
                writeLog("Erro: " + JSON.stringify(err));
            }
            setTimeout(function() {
                writeLog("Timeout ao conectar na porta: " + selectedPort);
            }, 5000);
        });
        //btnStart.disabled = false;
        //btnStop.disabled = true;
    });
    btnStop.addEventListener('click', function (event) {
        board = "";
        btnStart.disabled = false;
        btnStop.disabled = true;
    });
    btnRefresh.addEventListener('click', function (event) {
        serialPortList(serialPorts);
        btnStart.disabled = true;
    });

    $('#simple-notifier').addEventListener('click', function (event) {
        showNotification('./img/ic_add_24px.svg', "Taxi is arrived", 'hurry up');
    });

    $('#node-notifier').addEventListener('click', function (event) {
        showNativeNotification('./img/ic_error_24px.svg', "Testing Node Notifier", 'hurry up', './sounds/arpeggio.mp3', './img/ic_add_24px.svg');
    });


    // bring window to front when open via terminal
    win.focus();

    // for nw-notify frameless windows
    win.on('close', function() {
        NW.App.quit();
    });

    let serialPortList = function(serialPorts){
        serialPortLib.list(function(err, ports) {
            writeLog("Verificando portas!!");

            serialPorts.innerHTML = "<option value=''></option>";

            ports.forEach(function(p) {
                let portID = "port" + cont;
                serialPorts.innerHTML += "<option id='" + portID + "' value='" + p.comName.toString() + "'>" + p.comName.toString() + "</option>";
                cont++;
            });

            serialPorts.selectedIndex = 0;
        });
    };

    serialPortList(serialPorts);
});

let startMotion = function (sensor) {
    let motion = new five.Motion(sensor.configurations.pin);
    motion.active = true;
    motion.key = sensor.key;

    motion.on("calibrated", function () {
        writeLog("Sensor " + motion.key + " Calibrado", Date.now());
    });

    motion.on("motionstart", function () {
        writeLog("Sensor " + motion.key );
        writeLog("Identificou movimentação", Date.now());
    });

    motion.on("motionend", function () {
        writeLog("Sensor " + motion.key );
        writeLog("Fim de movimentação ", Date.now());
    });

    motion.on("change", function (data) {

        if (data.detectedMotion == motion.lastReading) return;

        motion.lastReading = data.detectedMotion;
        writeLog("Sensor: " + motion.key);
        writeLog("Leitura:" + JSON.stringify(data));

        alerts[motion.key].lastUpdate = {
            date: Date.now(),
            unit: "",
            value: (data.detectedMotion?"!":""),
            raw: data
        };
        writeLog("--> Atualizando alerta.");
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
        writeLog("--> Alerta atualizado.");
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

    writeLog("Temperatura: " + sensor.key);
    writeLog("-->controller: " + sensor.configurations.controller);
    writeLog("-->freq: " + sensor.configurations.loop);
    writeLog("-->threshold: " + sensor.configurations.threshold);
    writeLog("-->pin: " + sensor.configurations.pin);

    // VOUT = 1500 mV at 150°C
    // VOUT = 250 mV at 25°C
    // VOUT = –550 mV at –55°C
    // 10mV = 1°C

    let temperature = new five.Thermometer({
        controller: sensor.configurations.controller,
        freq : sensor.configurations.loop,
        threshold : sensor.configurations.threshold,
        pin: sensor.configurations.pin,
        toCelsius: function(raw) {
                return Math.round(( raw * 100 ) / 1024);
        }
    });
    temperature.active = true;
    temperature.key = sensor.key;
    temperature.lastReading = 0;

    temperature.on("change", function(data) {
        if (this.C == temperature.lastReading) return;

        temperature.lastReading = this.C;

        writeLog("Sensor: " + temperature.key);
        writeLog("-->Celsius:" + this.C);

        alerts[temperature.key].lastUpdate = {
            date: Date.now(),
            unit: "°C",
            value: this.C,
            raw: {
                celsius: this.C,
                fahrenheit: this.F,
                kelvin: this.K
            }
        };
        writeLog("--> Atualizando alerta.");
        if (this.C > 28) {
            temperature.alert = true;
            alerts[temperature.key].active = true;
            alerts[temperature.key].severity = "red";
            alerts[temperature.key].startDate = Date.now();
            updateAlert("public", temperature.key, alerts[temperature.key]);
        } else if (this.C < 15) {
            temperature.alert = true;
            alerts[temperature.key].active = true;
            alerts[temperature.key].severity = "blue";
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

        writeLog("Alerta atualizado.");

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

        alerts[anySensor.key].lastUpdate = {
            date: Date.now(),
            unit: sensor.configurations.unit,
            value: this.scaledReadingValue,
            raw: this
        };
        alerts[anySensor.key].lastReading = this.scaledReadingValue;

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
    // writeLog("Atualizando alerta:  " + key);
};

let removeAlert = function (accessType, key) {
    firebase.database().ref('alerts/' + accessType + '/'+ key).remove();
    // writeLog("Removendo alerta:  " + key);
};

let updateReadings = function (reading, key) {
    // writeLog("Atualizando leitura:  " + key);
    let sessionsRef = firebase.database().ref('readings/'+ key);
    sessionsRef.update(reading);
    // writeLog("Leitura atualizada:  " + key);

    refSensors.child(key+'/readings').update(reading);
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

    if (logElement.innerHTML.split(/'<br>'/).length > 20) logElement.innerHTML = "";

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
        win.focus();
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
            window.current().alert("Can not load module 'node-notifier'.\nPlease run 'npm install'");
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
            win.focus();
        }
    });

    writeLog("-----<br>node-notifier: " + title);
};
