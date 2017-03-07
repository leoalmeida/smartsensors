'use strict'

const http = require('http');
const port = process.env.PORT || 8080;
const app = require('../app');
const httpServer = http.createServer(app);

/* socket usage
    const getDecorateIO = require('./devices');
    const io = require('socket.io')(httpServer);
    var startBoard = getDecorateIO();
    startBoard(io);
*/

const server = httpServer.listen(port, function(){
    console.log('Listen on port ' + port);
});

/*const facebookActionsObj = require('./facebookactions');
const twitterActionsObj = require('./twitteractions');
const actionsObj = require('./nodeactions');

let facebookActionTrends = function () {
    console.log("Verificando Face");

    facebookActionsObj.verifyFacebookInfo("topic", "cacaushow");

    setTimeout(facebookActionTrends,1800000);
};

let twitterActionTrends = function () {
    console.log("Verificando Trends");

    twitterActionsObj.verifyTweets();

    setTimeout(twitterActionTrends,1800000);
};

let twitterActionSearch = function () {
    console.log("Verificando Tweets");

    twitterActionsObj.searchTweets("#cacaushow");

    setTimeout(twitterActionSearch,1800000);
};

let sensorsActionProcess = function () {
    console.log(actionsObj.runactions());
    if (!actionsObj.runactions()) return;
    actionsObj.generateLog("Iniciando processamento de ações");

    if (!actionsObj.validateAllData()) return;

    for (let value of Object.keys(actionsObj.recipes)) {
        let recipe = actionsObj.recipes[value];
        //process.stdout.write(value + "Recipe Enabled: " + recipe.enabled + '\n');
        if (!recipe.enabled) continue;

        let selectedScenario = "";
        let performAction = false;

        recipe_block: for (let item  of recipe.container) {
            //process.stdout.write("Type: " + item.type.value + '\n');
            if (item.type.value = "sensor") {
                //process.stdout.write(JSON.stringify(item) + '\n');
                if (!actionsObj.validateSensor(item.key)){
                    performAction = false;
                    break;
                }
                process.stdout.write('VErd \n');
                performAction = true;
                let readings = actionsObj.getSensorReadings(item.key);
                for (let scenario of item.scenarios) {
                    //console.log(JSON.stringify(scenario));
                    let evaluatedRead =  readings[scenario.rules[0].evaluatedAttribute];
                    if (evaluatedRead == scenario.rules[0].expectedResult) {
                        performAction = true;
                        selectedScenario = scenario.scenario;
                        console.log("PerformAction " + performAction + " scenario " + selectedScenario);
                        break;
                    } else if (!scenario.rules[0].logicalOperator || scenario.rules[0].logicalOperator == "&&") {
                        performAction = false;
                    }
                }
            } else if (item.type.value = "container") {
                continue;
            }
        }

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
                        alertInfo.lastUpdates = "";//actionsObj.getActuatorUpdates(item.key);

                        process.stdout.write(JSON.stringify(item.rules[selectedScenario]) + '\n');
                        for (let value  of item.rules[selectedScenario].values) {
                            //process.stdout.write(JSON.stringify(action) + '\n');
                            alertInfo[value.changedAttribute] = value.changedValue;
                        };
                        if (!item.key) {
                            alertInfo.startDate = Date.now();
                            actionsObj.createAlert(recipe.key, actionItem, alertInfo);
                        } else {
                            alertInfo.updatedDate = Date.now();
                            actionsObj.updateAlert(item.key, alertInfo);
                        }
                    } else if (item.rules[selectedScenario].type == "remove") {
                        //rule.alert.releaseDate = Date.now();
                        actionsObj.removeAlert(item.key, recipe.key);
                    }
                }
            }
        }
    }

    actionsObj.generateLog("Fim do processamento de ações");

    //setTimeout(sensorsActionProcess, 1000);
    setTimeout(sensorsActionProcess,1800000);
};


//facebookActionTrends();
//twitterActionTrends();
//twitterActionSearch();
//sensorsActionProcess();
*/

