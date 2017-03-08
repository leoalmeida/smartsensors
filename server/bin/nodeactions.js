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

var createAlert = function (recipeKey, itemKey, alertinfo) {
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

var updateAlert = function (alertKey, alertinfo) {
    let alertsListRef = db.ref('alerts/public/').child(alertKey);

    alertsListRef.update(alertinfo).then(function() {
            console.log('Alerta sincronizado.');
        });
};

var removeAlert = function (recipeKey, itemKey, key) {
    db.ref('alerts/public/').child(key)
        .remove()
        .then(function() {
            db.ref('recipes/public/' + recipeKey + "/actionContainer/" + itemKey).child('key').set("");
            console.log("Alerta Removido.")
        });
    // console.log("Removendo alerta:  " + key);
};

var actuatorPerformAction = function (key, changes) {
    console.log("Executando ação: Sensor-" + key + " Estado- " + JSON.stringify(changes) + '\n');
    db.ref('actuators/public/').child(key).update(changes);
};

var validateAllData = function () {
    console.log("Sensores: "+ Object.keys(sensors).length);
    console.log("Atuadores: "+Object.keys(actuators).length);
    if (!Object.keys(sensors).length || !Object.keys(actuators).length) return false;
    else return true;
};

var validateSensor = function (value) {
    console.log("Sensors: "+  value);
    let sensor = sensors[value];
    if (!sensor || !sensor.connected) return false;
    else return true;
};

var validateActuator = function (value) {
    let actuator = actuators[actuators.indexOf(value)];
    console.log("Actuator: "+  JSON.stringify(actuator));
    if (!actuator || !actuator.connected) return false;
    else return true;
};

var getSensorReadings = function (value) {
    return sensors[value].readings;
}

var getActuatorUpdates = function (value) {
    return actuators[value].lastUpdates;
};

var processFormula = function (recipe) {

    let performAction = false;
    let sentenceAttributes = [];
    let sentenceOperator = "";
    let sentenceQue = [], sentenceArray = [];
    let rootSentence = true;

    for (let item  of recipe.ruleContainer) {
        //process.stdout.write("Type: " + item.type.value + '\n');
        let sentenceResult = false;
        switch (item.type){
            case "separador":
                rootSentence = (rootSentence = false);
                continue;
            case "operador":
                if (item.subtype === "boleano")
                    if (sentenceArray.length > 0) sentenceArray.push(item.label);
                    else sentenceQue.push(item.label);
                sentenceOperator = item.label;
                continue;
            case "valor":
                sentenceAttributes.push(item.value);
                break;
            case "sensor":
                if (!validateSensor(item.key)){
                    return false;
                }
                let readings = getSensorReadings(item.key);
                sentenceAttributes.push(readings[item.evaluatedAttribute]);
                break;
            default:
                return false;
        };

        if (sentenceAttributes.length == 2) {
            switch (sentenceOperator){
                case "GT":
                    sentenceResult = (sentenceAttributes[0] > sentenceAttributes[1]);
                    break;
                case "GE":
                    sentenceResult = (sentenceAttributes[0] >= sentenceAttributes[1]);
                    break;
                case "LT":
                    sentenceResult = (sentenceAttributes[0] < sentenceAttributes[1]);
                    break;
                case "LE":
                    sentenceResult = (sentenceAttributes[0] <= sentenceAttributes[1]);
                    break;
                case "EQ":
                    sentenceResult = (sentenceAttributes[0] == sentenceAttributes[1]);
                    break;
                case "NE":
                    sentenceResult = (sentenceAttributes[0] != sentenceAttributes[1]);
                    break;
            }
            if (rootSentence)
                sentenceQue.push(sentenceResult);
            else if (sentenceArray.length > 0) {
                switch (sentenceArray[1]) {
                    case "AND":
                        sentenceResult = (sentenceArray[0] && sentenceResult);
                        break;
                    case "OR":
                        sentenceResult = (sentenceArray[0] || sentenceResult);
                        break;
                    case "NOT":
                        break;
                    default:
                        return false;
                }
                sentenceQue.push(sentenceResult);
                sentenceArray = [];
            } else{
                sentenceArray.push(sentenceResult);
            }
        }
    }
};

funclist.processAllRecipes = function () {

    if (!validateAllData()) return;

    for (let value of Object.keys(recipes)) {
        let recipe = recipes[value];
        //process.stdout.write(value + "Recipe Enabled: " + recipe.enabled + '\n');
        if (!recipe.enabled) continue;

        let selectedScenario = "";

        let performAction = processFormula(recipe);

        if (performAction) {
            let actionItem = -1;
            for (let item of recipe.actionContainer) {
                actionItem++;
                process.stdout.write("Type: " + item.type.value + '\n');
                if (item.type.value == "actuator") {
                    let actionObj = {};
                    process.stdout.write(JSON.stringify(item.rules[selectedScenario]) + '\n');
                    for (let action  of item.rules[selectedScenario].actions) {
                        //process.stdout.write(JSON.stringify(action) + '\n');
                        actionObj[action.changedAttribute] = action.changedValue;
                    }
                    if (Object.keys(actionObj) > 0) actuatorPerformAction(item.key, actionObj);
                } else if (item.type.value == "alert") {
                    let alertInfo = {};

                    if (item.rules[selectedScenario].type == "update") {
                        alertInfo.lastUpdates = "";//getActuatorUpdates(item.key);

                        process.stdout.write(JSON.stringify(item.rules[selectedScenario]) + '\n');
                        for (let value  of item.rules[selectedScenario].values) {
                            //process.stdout.write(JSON.stringify(action) + '\n');
                            alertInfo[value.changedAttribute] = value.changedValue;
                        };
                        if (!item.key) {
                            alertInfo.startDate = Date.now();
                            createAlert(recipe.key, actionItem, alertInfo);
                        } else {
                            alertInfo.updatedDate = Date.now();
                            updateAlert(item.key, alertInfo);
                        }
                    } else if (item.rules[selectedScenario].type == "remove") {
                        //rule.alert.releaseDate = Date.now();
                        removeAlert(item.key, recipe.key);
                    }
                }
            }
        }
    }
};

funclist.generateLog = function (message) {
    let log = {
        msg: message,
        date: Date.now()
    }
    db.ref('logs').push(log);
};

funclist.runactions = function () {
    return runactions;
};

/*funclist.recipes = function () {
    return recipes;
};*/

module.exports = funclist;