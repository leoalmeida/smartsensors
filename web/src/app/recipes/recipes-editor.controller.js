(function(angular) {
    'use strict';

    var icons = {
        point: {
            url: "assets/icons/action/ic_alarm_24px.svg",
            size: [32, 32],
            origin: [0,0],
            anchor: [0,32]
        }
    };

    var shape = {
        coords: [1, 1, 1, 20, 18, 20, 18 , 1],
        type: 'poly'
    };

    angular
        .module('app.recipes')
        .controller('RecipeCreatorController', RecipeCreatorController);


    RecipeCreatorController.$inject = ['$scope', '$filter', '$location', 'currentUser', '$timeout', '$routeParams', 'CONSTANTS', '$mdDialog', 'SensorsService', 'RecipesService', 'NotifyService',  'NgMap', 'refDataInfoService'];


    function RecipeCreatorController($scope, $filter, $location, currentUser, $timeout, $routeParams, CONSTANTS, $mdDialog, sensorsService, recipesService, notifyService, NgMap, refDataInfoService) {
        var vm = this;
        var key = $routeParams.id;

        vm.debugger = false;

        vm.SCREENCONFIG = CONSTANTS.SCREENCONFIG.RECIPES;

        vm.models =  {
            selected: null,
            templates: [
                {type: "action", id: 4},
                {type: "sensor", id: 3},
                {type: "connector", id: 2, objects: [[],[]]},
                {type: "container", id: 1, objects: []}
            ],
            allowedTypes: ['connector','sensor'],
            actionAllowedTypes: ['action']
        };

        if ($routeParams.type === "edit") {
            vm.activity = "Alterar Receita";

            //vm.models.recipe = recipesService.getOne(key);
            vm.models.recipe = {
                    "actionContainer" : [ {
                        "icon" : "assets/icons/led.svg",
                        "key" : "-KTkKh9ItnL1n6Ymfni8",
                        "name" : "Controlador de Água",
                        "rules" : [ {
                            "actions" : [ {
                                "changedAttribute" : "value",
                                "changedValue" : false
                            } ],
                            "alert" : {
                                "activate" : false,
                                "lastUpdate" : true,
                                "severity" : "green"
                            },
                            "type" : "sensor"
                        }, {
                            "actions" : [ {
                                "changedAttribute" : "value",
                                "changedValue" : true
                            } ],
                            "alert" : {
                                "activate" : true,
                                "lastUpdate" : true,
                                "severity" : "red"
                            },
                            "type" : "sensor"
                        } ],
                        "type" : "action"
                    }, {
                        "icon" : "assets/icons/led.svg",
                        "key" : "-KTkKh9ItnL1n6Ymfnil",
                        "name" : "Led",
                        "rules" : [ {
                            "actions" : [ {
                                "changedAttribute" : "connected",
                                "changedValue" : true
                            } ],
                            "alert" : {
                                "activate" : true,
                                "lastReading" : true,
                                "lastUpdate" : true,
                                "severity" : "red"
                            },
                            "type" : "sensor"
                        }, {
                            "actions" : [ {
                                "changedAttribute" : "value",
                                "changedValue" : false
                            } ],
                            "alert" : {
                                "activate" : false,
                                "lastReading" : true,
                                "lastUpdate" : true,
                                "severity" : "green"
                            },
                            "type" : "sensor"
                        } ],
                        "type" : "action"
                    } ],
                    "alert" : {
                        "active" : false,
                        "configurations" : {
                            "col" : 1,
                            "draggable" : false,
                            "icon" : "assets/icons/action/ic_class_24px.svg",
                            "key" : "-KZm41c1lLpEk7CHDOU3",
                            "label" : "001",
                            "localization" : {
                                "image" : "assets/images/profile_header0.png"
                            },
                            "name" : "Controle de Água",
                            "owner" : "Leonardo Almeida",
                            "pin" : {
                                "color" : "yellow"
                            },
                            "row" : 1,
                            "sensors" : [ "-KToB_eh1EVnQutA9h_M", "-KTkKh9ItnL1n6Ymfnil" ],
                            "type" : "actionperformed"
                        },
                        "lastReading" : "",
                        "lastUpdate" : "",
                        "severity" : "",
                        "startDate" : ""
                    },
                    "container" : [ {
                        "icon" : "assets/icons/motion.svg",
                        "key" : "-KToB_eh1EVnQutA9h_M",
                        "name" : "Motion",
                        "rules" : [{
                            "compareOperator" : "==",
                            "evaluatedAttribute" : "value",
                            "evaluatedObjectKey" : "-KToB_eh1EVnQutA9h_M",
                            "expectedResult" : 1,
                            "logicalOperator" : ""
                        }],
                        "scenarios" : [
                            {"label" : "Movimento Identificado",
                            "scenario" : 0,
                            "rules" : [{
                                "compareOperator" : "==",
                                "evaluatedAttribute" : "value",
                                "expectedResult" : 1,
                                "logicalOperator" : ""
                            }]
                            },
                            {"label" : "Sem Movimento",
                            "scenario" : 1,
                            "rules" : [{
                                    "compareOperator" : "==",
                                    "evaluatedAttribute" : "value",
                                    "expectedResult" : 1,
                                    "logicalOperator" : ""
                                }]
                            }
                        ],
                        "type" : "sensor"
                    } ],
                    "enabled" : true,
                    "icon" : "assets/icons/action/ic_class_24px.svg",
                    "key" : "-KZm41c1lLpEk7CHDOU3",
                    "label" : "Controle de Água",
                    "max" : 1,
                    "maxActions" : 2,
                    "subscribers" : [ "0000", "1111" ]
            };

        } else {
            vm.activity = "Nova Receita";
            vm.models.recipe = {
                icon: "assets/icons/action/ic_class_24px.svg",
                enabled: true,
                label: "",
                key: "",
                max: 1,
                maxActions: 2,
                container: [],
                actionContainer: [],
                subscribers: [
                    currentUser.uid
                ]
            }
        };

        var item = key;

        vm.submit = function () {

            /*if (item) {
                vm.models.recipe.$save();
            } else{
                item = recipesService.pushNewItem(vm.recipe);
            }*/

            if ($routeParams.type === "edit") {
                vm.models.recipe.$save();
                var message =  'Receita ' + vm.models.recipe.label + ' foi atualizada.';
                notifyService.notify('Receita atualizada', message);
            } else{
                vm.accessType = vm.isPrivateAccess ? "private": "public";
                item = recipesService.addOne(currentUser, vm.accessType , vm.models.recipe);
                var message =  'Receita ' + vm.models.recipe.label + ' encontrada.';
                notifyService.notify('Nova receita encontrada', message);
            }
            vm.navigateTo("recipes");

        };

        vm.cancel = function () {
            vm.navigateTo("recipes");
        }

        vm.navigateTo = function(key){
            $location.path("/" + key);
        };

        var loadInfoData = function() {
            var infoData = this.data;
            vm.pins = infoData.pins;
            vm.units = infoData.units;
            vm.icons = infoData.icons;
            vm.types = infoData.types;
            vm.states = infoData.states;
            vm.countries = infoData.country;
            vm.addressTypes = infoData.addressTypes;
            vm.localTypes = infoData.localTypes;
            vm.signTypes = infoData.signTypes;
            vm.connectors = infoData.connectorsTypes;
            for (var i=0; i< vm.connectors.length; i++) {
                vm.connectors[i].objects = [[]];
            }
        };
        vm.configurations = refDataInfoService.getRefDataInfo('refdata', loadInfoData);

        //var infoWindow = new google.maps.InfoWindow();

        vm.mapZoom=17;
        vm.mapCenter = [-21.980892, -47.881379];
        vm.point = icons.point;
        vm.shape = shape;
        vm.sensors = [];
        vm.actions = [];

        NgMap.getMap().then(function(map) {
            vm.map = map;
            var list = sensorsService.getAll();
            list.$loaded()
                .then(function(data) {
                    vm.sensors = data;
                    //console.log(JSON.stringify(data));
                    vm.sensors2 = $filter('PublicSensorFilter')(data, [{"column": "style", "value": "sensor", "extension": "configurations"},{"column": "enabled","value": true}]);
                    vm.actions = $filter('PublicSensorFilter')(data, [{"column": "style", "value": "action", "extension": "configurations"},{"column": "enabled","value": true}]);
                }, function(error) {
                    console.error("Error:", error);
                });

        });

        vm.toggleBounce = function() {
            if (this.getAnimation() != null) {
                this.setAnimation(null);
            } else {
                this.setAnimation(google.maps.Animation.BOUNCE);
            }
        };

        vm.selected = null;

        // On opening, add a delayed property which shows tooltips after the speed dial has opened
        // so that they have the proper position; if closing, immediately hide the tooltips
        vm.hidden = false;
        vm.isOpen = false;
        vm.hover = false;
        $scope.$watch('vm.pallete2.isOpen', function(isOpen) {
            if (isOpen) {
                $timeout(function() {
                    $scope.tooltipVisible = self.isOpen;
                }, 600);
            } else {
                $scope.tooltipVisible = self.isOpen;
            }
        });
        $scope.$watch('vm.pallete3.isOpen', function(isOpen) {
            if (isOpen) {
                $timeout(function() {
                    $scope.tooltipVisible = self.isOpen;
                }, 600);
            } else {
                $scope.tooltipVisible = self.isOpen;
            }
        });

        // Model to JSON for demo purpose
        $scope.$watch('vm.models', function(model) {
            vm.modelAsJson = angular.toJson(model, true);
        }, true);


        vm.helpResult = '  ';
        vm.customFullscreen = false;

        vm.showConfig = function(ev, type) {
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
                    vm.hide = function() {
                        $mdDialog.hide();
                    };
                    vm.closeDialog = function(result) {
                        $mdDialog.hide(result);
                    }
                    vm.cancel = function() {
                        $mdDialog.cancel();
                    };
                    vm.changeAlert = function() {

                    };
                    vm.changeAction = function() {

                    };
                    vm.addAction = function() {

                    };
                    vm.removeAction = function() {

                    };
                    vm.addRule = function(scenario) {
                        if (vm.models.selected.type == "sensor") {
                            vm.models.selected.scenarios[scenario].rules[vm.models.selected.scenarios[scenario].rules.length - 1].logicalOperator = "&&";
                            vm.models.selected.scenarios[scenario].rules.push({"compareOperator": ">","expectedResult": 0, "evaluatedAttribute": "", "logicalOperator": "", "evaluatedObjectKey": vm.models.selected.key});
                        } else if (vm.models.selected.type == "action"){
                            vm.models.selected.rules.push({"actions": [{}],"alert": {"activate": true, "severity": "", "lastUpdate": true}, "type": ""});
                        }
                    };
                    vm.removeRule = function(scenario, index) {
                        vm.models.selected.scenarios[scenario].rules.splice(index, 1);
                        if (vm.models.selected.type == "sensor") {
                            vm.models.selected.scenarios[scenario].rules[vm.models.selected.scenarios[scenario].rules.length - 1].connector = "";
                        }
                    };
                    vm.getScenario = function(index) {
                        return vm.models.recipe.container[0].scenarios[index].label;
                    };
                },
                parent: angular.element(document.body),
                targetEvent: ev,
                templateUrl: 'app/recipes/config.'+ type +'.tmpl.html',
                clickOutsideToClose:true,
                scope: $scope,
                preserveScope: true
            })
            .then(function(result)  {
                                        vm.helpResult = result;
                                    }, function() {
                                        vm.helpResult = ' ';
                                    });
        };

        vm.showDetail = function(event, marker) {
            vm.mapCenter = event.latLng;
            vm.selected = vm.sensors2[marker];
            vm.map.showInfoWindow('external', this);

        };
    }

})(angular);
