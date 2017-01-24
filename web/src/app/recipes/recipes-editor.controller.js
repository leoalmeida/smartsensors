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
              {type: "sensor", id: 3},
              {type: "connector", id: 2, objects: [[],[]]},
              {type: "container", id: 1, objects: []}
            ],
            allowedTypes: ['connector']
        };
        if ($routeParams.type === "edit") {
            vm.activity = "Alterar Receita";
            vm.models.recipes = [];
            recipesService.getOne(key).$loaded().then(function(x) {
                vm.models.recipes.push(x);
            }, function (errorObject) {
                console.log("The read failed: " + errorObject.code);
                return errorObject;
            });

        } else {
            vm.activity = "Nova Receita";
            vm.models.recipes = [{
                icon: "assets/icons/action/ic_class_24px.svg",
                enabled: true,
                label: "",
                max: 1,
                container: [],
                subscribers: [
                    currentUser.uid
                ]
            }]
        };

        var item = key;

        vm.submit = function () {

            /*if (item) {
                vm.models.recipes.$save();
            } else{
                item = recipesService.pushNewItem(vm.recipe);
            }*/

            if ($routeParams.type === "edit") {
                vm.models.recipes[0].$save();
                var message =  'Receita ' + vm.models.recipes.label + ' foi atualizada.';
                notifyService.notify('Receita atualizada', message);
            } else{
                vm.accessType = vm.isPrivateAccess ? "private": "public";
                item = recipesService.addOne(currentUser, vm.accessType , vm.models.recipes[0]);
                var message =  'Receita ' + vm.models.recipes.label + ' encontrada.';
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

        var infoWindow = new google.maps.InfoWindow();

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
                    vm.sensors2 = $filter('PublicSensorFilter')(data, {"0": {"column": "style","value": "sensor"},"1": {"column": "enabled","value": true}});
                    vm.actions = $filter('PublicSensorFilter')(data, {"0": {"column": "style","value": "action"},"1": {"column": "enabled","value": true}});
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
        $scope.$watch('vm.pallete1.isOpen', function(isOpen) {
            if (isOpen) {
                $timeout(function() {
                    $scope.tooltipVisible = self.isOpen;
                }, 600);
            } else {
                $scope.tooltipVisible = self.isOpen;
            }
        });
        $scope.$watch('vm.pallete2.isOpen', function(isOpen) {
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

        vm.showConfig = function(ev) {
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
                    vm.addRule = function() {
                        vm.models.selected.rules[vm.models.selected.rules.length-1].connector="&&";
                        vm.models.selected.rules.push({"sign": ">","value": 0,"connector": ""});
                    };
                    vm.removeRule = function(index) {
                        vm.models.selected.rules.splice(index, 1);
                        vm.models.selected.rules[vm.models.selected.rules.length-1].connector="";
                    };
                },
                parent: angular.element(document.body),
                targetEvent: ev,
                templateUrl: 'app/recipes/config.tmpl.html',
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
