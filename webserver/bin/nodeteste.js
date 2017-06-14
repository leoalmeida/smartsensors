const actionsObj = require('./nodeactions');

setInterval(function () {
    console.log("Executando ação:");

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
                performAction = true;
                let readings = actionsObj.getSensorReadings(item.key);
                for (let scenario of item.scenarios) {
                    //console.log(JSON.stringify(scenario));
                    //console.log(JSON.stringify(readings));
                    let evaluatedRead = readings[scenario.rules[0].evaluatedAttribute];
                    let compare = false;

                    if (scenario.rules[0].compareOperator == "==")
                        compare = (evaluatedRead == scenario.rules[0].expectedResult);
                    else if (scenario.rules[0].compareOperator == ">")
                        compare = (evaluatedRead > scenario.rules[0].expectedResult);
                    else if (scenario.rules[0].compareOperator == "<")
                        compare = (evaluatedRead < scenario.rules[0].expectedResult);
                    else if (scenario.rules[0].compareOperator == ">=")
                        compare = (evaluatedRead >= scenario.rules[0].expectedResult);
                    else if (scenario.rules[0].compareOperator == "<=")
                        compare = (evaluatedRead <= scenario.rules[0].expectedResult);

                    if (compare) {
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
                    let actionInfo = {};
                    //process.stdout.write(JSON.stringify(item.rules[selectedScenario]) + '\n');
                    for (let action  of item.rules[selectedScenario].actions) {
                        process.stdout.write(JSON.stringify(action) + '\n');
                        actionInfo[action.changedAttribute] = action.changedValue;
                    }
                    if (Object.keys(actionInfo).length > 0) actionsObj.actuatorPerformAction(item.key, actionInfo);
                } else if (item.type.value == "alert") {
                    let alertInfo = {};

                    if (item.rules[selectedScenario].type == "update") {
                        alertInfo.lastUpdates = "";//actionsObj.getActuatorUpdates(item.key);

                        //process.stdout.write(JSON.stringify(item.rules[selectedScenario]) + '\n');
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
}, 10000);