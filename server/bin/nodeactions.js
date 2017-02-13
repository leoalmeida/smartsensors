'use strict';

const funclist = require('express').Router();


const db = require('../db');

let sensors={}, recipes={}, actuators={}, info={};

let runactions = false;

db.ref('configurations/runactions')
    .on("value", function (snapshot) {
        let item = snapshot.val() ;
        if (!item) {
            runactions = false;
            return;
        }
        runactions = true;
    });

db.ref('recipes/public/')
    .on("child_added", function (snapshot) {
        let item = snapshot.val() ;
        //console.log("ValRecipe: " + snapshot.key + "\n");
        if (!item.enabled) return;
        recipes[snapshot.key] = item;
    });
db.ref('recipes/public/')
    .on("child_changed", function (snapshot) {
        let item = snapshot.val() ;
        //console.log("ValRecipe: " + JSON.stringify(item) + "\n");
        if (!item.enabled) delete recipes[item.key];
        else recipes[item.key] = item;
    });
db.ref('recipes/public/')
    .on("child_removed", function (snapshot) {
    let item = snapshot.val() ;
    //console.log("ValRecipe: " + JSON.stringify(item) + "\n");
    //if (!recipes.enabled) return;
    recipes.splice(recipes.indexOf(item.key), 1);
});

db.ref('actuators/public/')
    .on("child_added", function (snapshot) {
        let item = snapshot.val() ;
        if (!item.enabled) return;
        //console.log("ValActuators: " + snapshot.key + " - " + item.enabled + "\n");
        actuators[snapshot.key] = item;
    });
db.ref('actuators/public/')
    .on("child_changed", function (snapshot) {
        let item = snapshot.val() ;
        //console.log("ValRecipe: " + JSON.stringify(item) + "\n");
        if (!item.enabled) delete actuators[item.key];
        else actuators[item.key] = item;
    });
db.ref('actuators/public/')
    .on("child_removed", function (snapshot) {
    let item = snapshot.val() ;
    //console.log("ValRecipe: " + JSON.stringify(item) + "\n");
    //if (!recipes.enabled) return;
    actuators.splice(actuators.indexOf(item.key), 1);
});

db.ref('sensors/public/')
    .on("child_added", function (snapshot) {
        let item = snapshot.val() ;
        if (!item.enabled) return;
        //console.log("ValSensor: " + snapshot.key + " - " + JSON.stringify(item) + "\n");
        sensors[snapshot.key] = item;
    });
db.ref('sensors/public/')
    .on("child_changed", function (snapshot) {
        let item = snapshot.val() ;
        //console.log("ValRecipe: " + JSON.stringify(item) + "\n");
        if (!item.enabled) delete sensors[item.key];
        else sensors[item.key] = item;
    });
db.ref('sensors/public/')
    .on("child_removed", function (snapshot) {
        let item = snapshot.val() ;
        //console.log("ValRecipe: " + JSON.stringify(item) + "\n");
        //if (!recipes.enabled) return;
        sensors.splice(sensors.indexOf(item.key), 1);
    });

db.ref('info/public/')
    .on("child_added", function (snapshot) {
        let item = snapshot.val() ;
        if (!item) return;
        //console.log("ValSensor: " + snapshot.key + " - " + JSON.stringify(item) + "\n");
        info[snapshot.key] = item;
    });
db.ref('info/public/')
    .on("child_changed", function (snapshot) {
        let item = snapshot.val() ;
        console.log("ValRecipe: " + JSON.stringify(item) + "\n");
        if (!item) delete info[item.key];
        else info[snapshot.key] = item;
    });
db.ref('info/public/')
    .on("child_removed", function (snapshot) {
        delete info[snapshot.key];
    });

/*refAllSensors = db.ref('sensors/').on("child_added", function (snapshot) {
    let item = [];
    item.push(snapshot.val());

    //console.log("--> New Sensor: " + JSON.stringify(item) + "\n");

    publicSensFilter(allSensors, item, [{"column": "enabled","value": true}]);
    publicSensFilter(allActuators, item, [{"column": "enabled","value": true}]);

    //console.log("--> New Sensors: " + JSON.stringify(allSensors) + "\n");
    //console.log("--> New Actuators: " + JSON.stringify(allActuators) + "\n");
});
*/

funclist.generateLog = function (message) {
    let log = {
        msg: message,
        date: Date.now()
    }
    db.ref('logs').push(log);
};

funclist.createAlert = function (recipeKey, itemKey, alertinfo) {
    let alert = {
        active: true,
        enabled: true,
        severity: alertinfo.severity,
        lastUpdates: alertinfo.lastUpdates,
        startDate: Date.now(),
        releaseDate: "",
        recipe: recipeKey,
        configurations: {
            col: 1,
            row: 1,
            draggable: false,
            icon: recipes[recipeKey].icon,
            label: recipes[recipeKey].label,
            image: recipes[recipeKey].image,
            pin: {color: "yellow"},
            sensors: "",
            type: "recipe",
            description: recipes[recipeKey].description,
            owner: recipes[recipeKey].owner
        }
    };

    console.log("Novo alerta:  " + JSON.stringify(alert));

    var alertsListRef = db.ref('alerts/public/').push();
    alertsListRef.set(alert).then(function(data) {
            console.log("Novo alerta:  " + alertsListRef.key);
            console.log("Val:  " + 'recipes/public/' + recipeKey + "/actionContainer/" + itemKey + '/key/' + alertsListRef.key);
            db.ref().child('recipes/public/' + recipeKey + "/actionContainer/" + itemKey + '/key').set(alertsListRef.key);

    }).catch(function(error) {
            console.log('Synchronization failed');
    });

    return alertsListRef.key;
};

funclist.updateAlert = function (alertKey, alertinfo) {
    let alertsListRef = db.ref('alerts/public/').child(alertKey);

    alertsListRef.update(alertinfo).then(function() {
            console.log('Alerta sincronizado.');
        });
};
funclist.removeAlert = function (recipeKey, itemKey, key) {
    db.ref('alerts/public/').child(key)
        .remove()
        .then(function() {
            db.ref('recipes/public/' + recipeKey + "/actionContainer/" + itemKey).child('key').set("");
            console.log("Alerta Removido.")
        });
    // console.log("Removendo alerta:  " + key);
};

funclist.actuatorPerformAction = function (key, changes) {
    console.log("Executando ação: Sensor-" + key + " Estado- " + JSON.stringify(changes) + '\n');
    db.ref('actuators/public/').child(key).update(changes);
};

funclist.validateAllData = function () {
    console.log("Sensores: "+ Object.keys(sensors).length);
    console.log("Atuadores: "+Object.keys(actuators).length);
    if (!Object.keys(sensors).length || !Object.keys(actuators).length) return false;
    else return true;
};

funclist.validateSensor = function (value) {
    console.log("Sensors: "+  value);
    let sensor = sensors[value];
    if (!sensor || !sensor.connected) return false;
    else return true;
};

funclist.validateActuator = function (value) {
    let actuator = actuators[actuators.indexOf(value)];
    console.log("Actuator: "+  JSON.stringify(actuator));
    if (!actuator || !actuator.connected) return false;
    else return true;
};

funclist.getSensorReadings = function (value) {
    return sensors[value].readings;
}

funclist.getActuatorUpdates = function (value) {
    return actuators[value].lastUpdates;
};

funclist.runactions = function () {
    return runactions;
};

funclist.recipes = function () {
    return recipes;
};

module.exports = funclist;