let EtherPortClient = require("etherport-client").EtherPortClient;
let Firmata = require("firmata");
let Five = require("johnny-five");

const db = require('../db');

// ******** Global Vars

let board, sensor;

let sensors={"connected":0}, actuators={"connected":0}, sinks={"connected":0};

let connectedsens, connectedacts;

let userKey, selectedSink, refSensors, refActuators, sinksList;

// ********************************** End Init

db.ref('sinks/public/')
.once("value", function (snapshot) {
    sinksList = JSON.stringify(snapshot.val());
});

function getDecorateIO() {

    function startBoard(io) {

        io.on('connection', function (socket) {
            console.log('New connection');
            socket.on('startBoard', function(data){
                console.log('starting board ');

                var params = JSON.parse(data);

                console.log('Params: ' + JSON.stringify(params));

                db.ref('/users/').orderByChild('email').equalTo(params.email).limitToFirst(1)
                    .once('child_added', function (snapshot) {

                    userKey = snapshot.val().uid;
                    console.log(userKey);

                    refSinks =
                        db.ref('sinks/public/').child(params.sink);

                    refSinks
                        .once("value", function (snapshot) {

                            selectedSink = snapshot.key;
                            let sink = snapshot.val();

                            if (!sink.enabled) {
                                console.log("Sink: " + sink.id + " desabilitado\n");
                                return;
                            }

                            console.log("Sink: " + selectedSink + " - " + sink.id + "\n");

                            if (sink.type === 'esp8266') {

                                refActuators = db.ref('actuators/public')
                                    .orderByChild('connectedSink/id')
                                    .equalTo(selectedSink);

                                refSensors = db.ref('sensors/public')
                                    .orderByChild('connectedSink/id')
                                    .equalTo(selectedSink);


                                console.log("IP: " + params.ip + " - Porta: " + params.port + "\n");
                                board = new Five.Board({
                                    io: new Firmata(new EtherPortClient({
                                        host: params.ip,
                                        port: params.port
                                    })),
                                    timeout: 1e5
                                });


                                console.log("--> Waiting \n");

                                board.on("ready", function () {
                                    console.log("READY!");
                                    console.log("Placa Conectada!!");
                                    console.log(
                                        "Firmware: " +
                                        this.io.name + "-" +
                                        this.io.version.major + "." +
                                        this.io.version.minor
                                    );

                                    updateEquipmentStatus('sinks', selectedSink, true);

                                    refActuators
                                        .on("child_added", function (snapshot) {
                                            let actuator = snapshot.val();

                                            console.log('Conectando Atuador' + actuator.key);

                                            if (actuator.enabled) {

                                                actuators[actuator.key] = actuator;

                                                console.log('Atuador [' + actuator.name + '] Encontrado!!\n');
                                                console.log("Conectando atuador [" + actuator.name + "]");

                                                if (actuator.type == "led") {
                                                    let object = startLed(actuator);
                                                    board.repl.inject({[object.id]: object});
                                                }
                                                else if (actuator.type == "relay") {
                                                    let object = startRelay(actuator);
                                                    board.repl.inject({[object.id]: object});
                                                }

                                                if (actuator.connected)
                                                    updateEquipmentStatus('actuators', actuator.key, (actuator.connected == true) ? false : true);


                                                console.log('Atuador [' + actuator.name + '] Habilitado!!');
                                                //};

                                            } else {
                                                console.log("Atuador [" + actuator.name + "] bloqueado.\n");
                                            }

                                        }, function (err) {
                                            console.log("Error [" + err + "]\n");

                                        });
                                    refActuators
                                        .on("child_changed", function (snapshot) {
                                            let updatedItem = snapshot.val();
                                            let obj = board.repl.context[updatedItem.key];

                                            //console.log(obj);
                                            //console.log("Sensor " + updatedItem.name + " foi modificado");
                                            //console.log(" Estado --> " + obj.enabled  + " | " + updatedItem.enabled);
                                            //console.log(" Conn --> " + obj.connected  + " | " + updatedItem.connected);

                                            if (obj.connected != updatedItem.connected) {
                                                obj.toggleConnect(updatedItem);
                                                if (updatedItem.connected) actuators.connected++;
                                                else actuators.connected--;
                                            }

                                            if (obj.enabled != updatedItem.enabled) {
                                                obj.toggleEnable();
                                                if (!updatedItem.connected) actuators.connected++;
                                                else actuators.connected--;
                                            }

                                            actuators[updatedItem.key] = updatedItem;
                                        });
                                    /*
                                     refActuators
                                     .on("child_removed", function (snapshot) {
                                     let item = snapshot.val();
                                     //console.log("ValRecipe: " + JSON.stringify(item) + "\n");
                                     //if (!recipes.enabled) return;
                                     actuators.splice(actuators.indexOf(item.key), 1);
                                     });
                                     */

                                    refSensors
                                        .on("child_added", function (snapshot) {
                                            let sensor = snapshot.val();

                                            if (sensor.enabled) {

                                                sensors[sensor.key] = sensor;

                                                console.log('Sensor [' + sensor.name + '] Encontrado!!\n');
                                                console.log("Conectando sensor [" + sensor.name + "]");

                                                if (sensor.type == "motion") {
                                                    let object = startMotion(sensor, io);
                                                    board.repl.inject({[object.id]: object});
                                                }
                                                else if (sensor.type == "hygrometer") {
                                                    let object = startHygrometer(sensor, io);
                                                    board.repl.inject({[object.id]: object});
                                                }
                                                else if (sensor.type == "flow") {
                                                    let object = startFlow(sensor, board, io);
                                                    board.repl.inject({[object.id]: object});
                                                }
                                                else if (sensor.type == "thermometer") {
                                                    let object = startThermometer(sensor, io);
                                                    board.repl.inject({[object.id]: object});
                                                }
                                                else if (sensor.type == "light") {
                                                    let object = startLight(sensor, io);
                                                    board.repl.inject({[object.id]: object});
                                                }
                                                else if (sensor.type == "multi") {
                                                    startMulti(sensor, io);
                                                }
                                                else if (sensor.type == "sensor") {
                                                    let object = startSensor(sensor, io);
                                                    board.repl.inject({[object.id]: object});
                                                }

                                                if (!sensor.connected) {
                                                    updateEquipmentStatus('sensors', sensor.key, (sensor.connected == true) ? false : true);
                                                    sensors.connected++;
                                                } else {
                                                    sensors.connected++;
                                                }

                                                console.log('Sensor [' + sensor.name + '] Habilitado!!');
                                                //};

                                            } else {
                                                console.log("Sensor [" + sensor.name + "] bloqueado.\n");
                                            }


                                        });
                                    refSensors
                                        .on("child_changed", function (snapshot) {
                                            let updatedItem = snapshot.val();
                                            let obj = board.repl.context[updatedItem.key];

                                            //console.log(obj);
                                            //console.log("Sensor " + updatedItem.name + " foi modificado");
                                            //console.log(" Estado --> " + obj.enabled  + " | " + updatedItem.enabled);
                                            //console.log(" Conn --> " + obj.connected  + " | " + updatedItem.connected);

                                            if (obj.connected != updatedItem.connected) {
                                                obj.toggleConnect(updatedItem);
                                                if (updatedItem.connected) sensors.connected++;
                                                else sensors.connected--;
                                            }

                                            if (obj.enabled != updatedItem.enabled) {
                                                obj.toggleEnable();
                                                if (!updatedItem.connected) sensors.connected++;
                                                else sensors.connected--;
                                            }

                                            sensors[updatedItem.key] = updatedItem;

                                        });
                                    /*
                                     refSensors
                                     .on("child_removed", function (snapshot) {
                                     let item = snapshot.val();
                                     //console.log("ValRecipe: " + JSON.stringify(item) + "\n");
                                     //if (!recipes.enabled) return;
                                     sensors.splice(sensors.indexOf(item.key), 1);
                                     });
                                     */

                                    /*board.loop(5000, function() {
                                     console.log("Testando regras\n");

                                     updateActions();
                                     });*/

                                    board.on('exit', function () {
                                        console.log('Desconectando\n');

                                        if (actuators.connected > 0) {
                                            for (let item of Object.keys(actuators)) {
                                                //console.log('Sensor [' + sensors[item].key + '] Estado ' +sensors[item].connected+ '\n');
                                                if (actuators[item].connected) {
                                                    connectedacts++;
                                                    console.log("Desconectando: " + item + '\n');
                                                    updateEquipmentStatus('actuators', item, (actuators[item].connected == true) ? false : true);
                                                }
                                            }
                                        }

                                        if (sensors.connected > 0) {
                                            for (let item of Object.keys(sensors)) {
                                                //console.log('Sensor [' + sensors[item].key + '] Estado ' +sensors[item].connected+ '\n');
                                                if (sensors[item].connected) {
                                                    connectedsens++;
                                                    console.log("Desconectando: " + item + '\n');
                                                    updateEquipmentStatus('sensors', item, (sensors[item].connected == true) ? false : true);
                                                }
                                            }
                                        }

                                        updateEquipmentStatus('sinks', selectedSink, false);

                                    });

                                });

                                if (process.platform === "win32") {
                                    var rl = require("readline")
                                        .createInterface({
                                            input: process.stdin,
                                            output: process.stdout
                                        });
                                    rl.on("SIGINT", function () {
                                        if (actuators.connected > 0) {
                                            for (let item of Object.keys(actuators)) {
                                                //console.log('Sensor [' + sensors[item].key + '] Estado ' +sensors[item].connected+ '\n');
                                                if (actuators[item].connected) {
                                                    connectedacts++;
                                                    console.log("Desconectando: " + item + '\n');
                                                    updateEquipmentStatus('actuators', item, (actuators[item].connected == true) ? false : true);
                                                }
                                            }
                                        }

                                        if (sensors.connected > 0) {
                                            for (let item of Object.keys(sensors)) {
                                                //console.log('Sensor [' + sensors[item].key + '] Estado ' +sensors[item].connected+ '\n');
                                                if (sensors[item].connected) {
                                                    connectedsens++;
                                                    console.log("Desconectando: " + item + '\n');
                                                    updateEquipmentStatus('sensors', item, (sensors[item].connected == true) ? false : true);
                                                }
                                            }
                                        }

                                        updateEquipmentStatus('sinks', params.sink, false);

                                    });
                                }

                                board.on("fail", function (err) {
                                    if (err) {
                                        console.log("Erro ao conectar ");
                                        console.log("Erro: " + JSON.stringify(err));
                                    }
                                    setTimeout(function () {
                                        console.log("Timeout ao conectar. ");
                                    }, 5000);
                                });

                                board.on("message", function (event) {
                                    console.log("Received a %s message, from %s, reporting: %s", event.type, event.class, event.message);
                                });
                            }
                        });

                    refSinks
                        .on("child_changed", function (snapshot) {
                            let updatedItem = snapshot.val();
                            console.log(updatedItem);
                            //console.log("Sensor " + updatedItem.name + " foi modificado");
                            //console.log(" Estado --> " + obj.enabled  + " | " + updatedItem.enabled);
                            //console.log(" Conn --> " + obj.connected  + " | " + updatedItem.connected);
                            let changedKeys = Object.keys(updatedItem);

                            if (changedKeys['connected'] && !updatedItem.connected) {
                                process.exit()
                            }
                        });

                });

            });
        });
    };

    return startBoard;
};

module.exports = getDecorateIO;

let startMotion = function (sensor, socket) {
    let object = new Five.Motion({
        pin: sensor.configurations.pin,
        id: sensor.key
    });
    object.enabled = sensor.enabled;
    object.connected = sensor.connected;
    object.key = sensor.key;
    object.lastReading = object.detectedMotion;
    object.action = sensor.configurations.action;
    object.template = sensor;

    object.toggleConnect = function (updated){
        //this.connected ? false : true;
        object.connected = updated.connected;
    };

    object.toggleEnable = function (updated){
        object.toggleConnect(updated);
    };


        console.log('Motion sockets on connection');

        object.on("calibrated", function () {
            console.log("Sensor " + object.key + " Calibrado", Date.now());
            socket.emit('motionData', "Calibrado");
        });

        object.on("motionstart", function () {
            console.log("Sensor " + object.key);
            console.log("Identificou movimentação", Date.now());
            socket.emit('motionData', "Mov");
        });

        object.on("motionend", function () {
            console.log("Sensor " + object.key);
            console.log("Fim de movimentação ", Date.now());
            socket.emit('motionData', "Fim");
        });

        object.on("change", function (data) {
            console.log("Sensor: " + object.key);
            console.log("Leitura:" + JSON.stringify(data));
            console.log("last: " + object.lastReading);
            console.log("enabled: " + object.enabled);

            if (!object.connected | data.detectedMotion == object.lastReading) return;

            object.lastReading = data.detectedMotion;
            console.log("Sensor: " + object.key);
            console.log("Leitura:" + JSON.stringify(data));

            let lastUpdate = {
                date: Date.now(),
                label: object.template.label,
                level: "",
                nonscaled: "",
                sensor: object.key,
                category: object.template.configurations.category,
                unit: "",
                value: (data.detectedMotion ? 1 : 0),
                raw: data,
                loops: 0
            };
            updateInfo(lastUpdate, object.template.configurations.category, object.key);

            socket.emit('motionData', (data.detectedMotion ? "Sim" : "Não"));
        });

        socket.emit('motionData', 'On');


    return object;
};
let startLed = function (sensor, socket) {
    let object = new Five.Led({
        pin: sensor.configurations.pin,
        id: sensor.key
    });
    object.enabled = sensor.enabled;
    object.connected = sensor.connected;
    object.template = sensor;

    object.toggleConnect = function(updatedItem) {
        if (updatedItem.connected) object.on();
        else object.stop().off();
        object.connected = updatedItem.connected;
        console.log("led: "+ this.isOn);

        if (object.isOn) {
            if (updatedItem.configurations.ledStyle == 0)
                object.blink(updatedItem.configurations.loop);
            else if (updatedItem.configurations.ledStyle == 1) {
                object.pulse({
                    easing: "linear",
                    duration: updatedItem.configurations.duration,
                    cuePoints: [0, 0.2, 0.4, 0.6, 0.8, 1],
                    keyFrames: [0, 10, 0, 50, 0, 255],
                    onstop: function () {
                        console.log("Animation stopped");
                    }
                });
                this.wait(updatedItem.configurations.loop, function () {

                    // stop() terminates the interval
                    // off() shuts the led off
                    object.stop().off();
                });
            }
            else if (updatedItem.configurations.ledStyle == 2) {
                object.fadeIn();

                // Toggle the led after 5 seconds (shown in ms)
                this.wait(updatedItem.configurations.loop, function () {
                    object.fadeOut();
                });
            }
        };
    }

    object.toggleEnable = function (updatedItem) {
        object.toggleConnect(updatedItem);
    };

    return object;
};
let startHygrometer = function (sensor, socket) {

    let object = new Five.Sensor({
        pin: sensor.configurations.pin,
        freq: sensor.configurations.loop,
        threshold: sensor.configurations.threshold,
        id: sensor.key
    });
    object.enabled= sensor.enabled
    object.connected = sensor.connected;
    object.key = sensor.key;
    object.lastReading = -1;
    object.quantity = 0;
    object.loops = 0;
    object.value = 0;
    object.template = sensor;
    object.maxval = sensor.configurations.maxval;
    object.action = sensor.configurations.action;

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

            if (!object.connected | object.scaledValue == object.lastReading) return;

            object.lastReading = object.scaledValue;
            object.quantity++;
            object.average = ((object.average * (object.quantity - 1)) + object.scaledValue) / object.quantity;

            //console.log("Hygrometer");
            //console.log("  Sensor: " + object.key);
            console.log("  Humidity : " + object.scaledValue);
            //console.log("  Average: " + object.average);
            let lastUpdate = {
                date: Date.now(),
                label: object.template.label,
                level: "",
                nonscaled: "",
                sensor: object.key,
                category: object.template.configurations.category,
                unit: "%",
                value: object.scaledValue,
                raw: object.value,
                loops: object.loops
            };
            updateInfo(lastUpdate, object.template.configurations.category, object.key);

            socket.emit('hygrometerData', object.scaledValue);
        });

        socket.emit('hygrometerData', 'On');


    return object;
};
let startThermometer = function (sensor, socket) {

    //console.log("Temperatura: " + sensor.key);
    //console.log("-->controller: " + sensor.configurations.controller);
    //console.log("-->freq: " + sensor.configurations.loop);
    //console.log("-->threshold: " + sensor.configurations.threshold);
    //console.log("-->pin: " + sensor.configurations.pin);
    // VOUT = 1500 mV at 150°C
    // VOUT = 250 mV at 25°C
    // VOUT = –550 mV at –55°C
    // 10mV = 1°C

    let object = new Five.Thermometer({
        controller: sensor.configurations.controller,
        freq : sensor.configurations.loop,
        pin: sensor.configurations.pin,
        toCelsius: function(raw) {
            if (sensor.configurations.controller === "ANALOGIC")
              return Math.round((raw * 180 ) / 1024) - 55;
            else
              return Math.round(( raw * 100 ) / 1024);
        },
        id: sensor.key
    });
    object.enabled = sensor.enabled;
    object.connected = sensor.connected;
    object.key = sensor.key;
    object.template = sensor;
    object.lastReading = 0;

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

            if (!object.connected | celsius == object.lastReading) return;

            object.lastReading = celsius;

            //console.log("Sensor: " + object.key);
            console.log("Temp: " + celsius);

            let lastUpdate = {
                date: Date.now(),
                label: object.template.label,
                level: "",
                nonscaled: "",
                sensor: object.key,
                category: object.template.configurations.category,
                unit: "°C",
                value: celsius,
                raw: {
                    celsius: this.C,
                    fahrenheit: this.F,
                    kelvin: this.K
                },
                loops: 0
            };
            updateInfo(lastUpdate, object.template.configurations.category, object.key);

            socket.emit('thermometerData', object.scaledValue);
        });

        socket.emit('thermometerData', 'On');


    return object;
};
let startFlow = function (sensor, board, socket) {

    //console.log("Flow: " + sensor.key);
    //console.log("-->freq: " + sensor.configurations.loop);
    //console.log("-->pin: " + sensor.configurations.pin);
    //console.log("-->max: " + sensor.configurations.maxval);
    //console.log("-->unit: " + sensor.configurations.unit);

    let object = new Five.Sensor.Digital({
        id: sensor.key,
        pin: sensor.configurations.pin
    });
    object.enabled = sensor.enabled;
    object.connected = sensor.connected;
    object.key = sensor.key;
    object.lastReading = [{x: [], y: []}];
    object.pulses = 0;
    object.lastFlowRateTimer = 0;
    object.lastFlowPinState = false;
    object.template = sensor;
    object.maxval = sensor.configurations.maxval;
    object.lastval = 0;

    object.toggleConnect = function (updated){
        //this.connected ? false : true;
        object.connected = updated.connected;
    };

    object.toggleEnable = function (updated){
        object.toggleConnect(updated);
    };

    /*object.on("change", function(value) {

     if (!object.lastReading.y | object.lastReading.y == object.lastval) return;

     updateInfo(lastUpdate, object.key);;

     object.lastval = object.lastReading.y;

     });*/

    /*object.on("data", function(data) {
     // send the pin status to objectSignal helper
     //object.objectSignal(data);
     console.log("Data Event");
     console.log("-->Data:" + data);
     console.log("-->Pulse:" + object.pulses);
     console.log("-->Rate:" + object.flowrate);
     console.log("----------------------");
     });*/

    board.digitalRead(sensor.configurations.pin, function(value) {
        // send the pin status to flowSignal helper
        //console.log("DigitalRead Event");
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

        socket.emit('flowData', object.lastReading.y + "l" );

    }, sensor.configurations.loop);

    socket.emit('flowData', 'On');


    return object;
};

let startLight = function (sensor, socket) {

    let object = new Five.Light({
        pin: sensor.configurations.pin,
        freq: sensor.configurations.loop,
        threshold: sensor.configurations.threshold,
        id: sensor.key
    });
    object.enabled = sensor.enabled;
    object.connected = sensor.connected;
    object.key = sensor.key;
    object.template = sensor;
    object.lastReading = 0;

    object.toggleConnect = function (updated){
        //this.connected ? false : true;
        object.connected = updated.connected;
    };

    object.toggleEnable = function (updated){
        object.toggleConnect(updated);
    };


        console.log('Light sockets on connection');
        object.on("change", function() {

            if (!object.connected | object.level == object.lastReading ) return;

            object.lastReading = object.level;

            object.percentage = Math.round(100 - (object.level * 100));

            console.log("Light: " + object.percentage);

            let lastUpdate = {
                date: Date.now(),
                label: object.template.label,
                level: object.level,
                nonscaled: "",
                sensor: object.key,
                category: object.template.configurations.category,
                unit: object.template.configurations.unit,
                value: object.percentage,
                raw: object.value,
                loops: 0
            };
            updateInfo(lastUpdate, object.template.configurations.category, object.key);
            socket.emit('lightData', object.percentage);
        });

        socket.emit('lightData', 'On');


    return object;
};
let startRelay = function (sensor, socket) {

    let object = new Five.Relay({
        pin: sensor.configurations.pin,
        type: sensor.configurations.type,
        id: sensor.key
    });
    object.enabled = sensor.enabled;
    object.connected = sensor.connected;
    object.template = sensor;
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
    }

    object.toggleEnable = function (updated) {
        object.toggleConnect(updated)
    };

    return object;
};
let startSensor = function (sensor, socket) {
    let object = new Five.Sensor({
        pin: sensor.configurations.pin,
        freq: sensor.configurations.loop,
        threshold: sensor.configurations.threshold,
        id: sensor.key
    });
    object.enabled = sensor.enabled;
    object.connected = sensor.connected;
    object.key = sensor.key;
    object.toggleConnect = function (updated){
        //this.connected ? false : true;
        object.connected = updated.connected;
    };

    object.toggleEnable = function (updated){
        object.toggleConnect(updated);
    };


        console.log('Sensor sockets on connection');

        // Scale the sensor's data from 0-1023 to 0-10 and log changes
        object.on("change", function() {
            this.scaledReadingValue = this.scaleTo(0, 100);

            if (!object.connected | this.scaledReadingValue == object.lastReading) return;

            let lastUpdate = {
                date: Date.now(),
                label: object.template.label,
                level: object.level,
                nonscaled: "",
                sensor: object.key,
                category: object.template.configurations.category,
                unit: sensor.configurations.unit,
                value: this.scaledReadingValue,
                raw: this,
                loops: 0
            };

            console.log("The reading value has changed.");

            console.log("New reading: " + this.scaledReadingValue );

            updateInfo(lastUpdate, object.template.configurations.category, object.key);

            socket.emit('sensorData', this.scaledReadingValue);
        });
        socket.emit('sensorData', 'On');


    return object;
};

let updateInfo = function (reading, type, key) {
    // console.log("Atualizando leitura:  " + key);
    let sessionRef = db.ref('info/public/'+ type);
    let newItemRef = sessionRef.push();
    newItemRef.set(reading)
        .then(function(data) {
            db.ref('sensors/public/'+ key)
                .child('readings').update(reading);
            // console.log("Leitura atualizada:  " + key);
        })
        .catch(function(error) {
            console.log('Readings Synchronization failed');
        });
};
let updateEquipmentStatus = function (equipment, equipmentKey, status) {
    console.log(equipment + " - " + equipmentKey + " status: " + status + '\n');
    let refSink = db.ref(equipment + '/public/');
    let updateitem = equipmentKey + "/connected";
    refSink.update({[updateitem]: status});
};

// helper function to keep track of pulses
let flowSignal = function (value, object) {
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
let bindAlarm = function (object) {
    let lastUpdate = {
        date: object.lastReading.x,
        label: object.template.label,
        level: "",
        nonscaled: "",
        sensor: object.key,
        category: object.template.configurations.category,
        unit: "l",
        value: parseFloat(Math.round(object.lastReading.y * 100) / 100).toFixed(2),
        raw: object.lastReading.y,
        loops: object.pulses
    };
    console.log("--> Last State:" + object.lastFlowPinState);

    updateInfo(lastUpdate, object.template.configurations.category, object.key);
};

// helper function to get a nicely formatted date string
let getDateString = function() {
    var time = new Date();
    // 10800000 is (GMT-3 Montreal)
    // for your timezone just multiply +/-GMT by 3600000
    var datestr = new Date(time - 10800000).toISOString().replace(/T/, ' ').replace(/Z/, '');
    return datestr;
}
