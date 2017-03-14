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


    RecipeCreatorController.$inject = ['$scope', '$filter', '$location', 'currentUser', '$timeout', '$routeParams', 'CONSTANTS', '$mdDialog', 'SensorsService', 'ActuatorsService', 'RecipesService', 'NotifyService',  'NgMap', 'refDataInfoService'];


    function RecipeCreatorController($scope, $filter, $location, currentUser, $timeout, $routeParams, CONSTANTS, $mdDialog, sensorsService, actuatorsService, recipesService, notifyService, NgMap, refDataInfoService) {
        var vm = this;
        var key = $routeParams.id;

        vm.debugger = false;
        vm.SCREENCONFIG = CONSTANTS.SCREENCONFIG.RECIPES;

        if ($routeParams.type === "edit") {
            vm.activity = "Alterar Receita";
            //vm.recipe = recipesService.getOne(key);

            vm.recipe = recipesService.getRecipe(key);
        } else {
            vm.activity = "Nova Receita";
            vm.recipe = {
                id: "",
                oaccess: "public",
                otype: "recipe",
                data: ""
            };
        };

        vm.configurations = sensorsService.getAllConfigurations();

        vm.configurations.$loaded().then(function(infoData) {
            vm.pins = infoData.pins;
            vm.units = infoData.units;
            vm.icons = infoData.icons;
            vm.types = infoData.types;
            vm.states = infoData.states;
            vm.countries = infoData.country;
            vm.addressTypes = infoData.addressTypes;
            vm.localTypes = infoData.localTypes;
            vm.signTypes = infoData.signTypes;
            vm.alertTypes = infoData.alertTypes;

            vm.searchOptionTypes = infoData.searchOptionTypes;
            vm.alertAttributes = infoData.alertAttributes;
            vm.alertAttributesValues = infoData.alertAttributesValues;

            vm.externalAPIs = infoData.externalAPIs;

            vm.recipes = infoData.templates.recipes;
            vm.connectors = infoData.templates.connectors;
            vm.rules = vm.rules.concat(loadItems(vm.connectors));
            vm.rules = vm.rules.concat(loadItems(infoData.templates.rules));
            vm.actions = vm.actions.concat(loadItems(infoData.templates.actions));

            for (var i=0; i< vm.connectors.length; i++) {
                vm.connectors[i].objects = [[]];
            }

            if (!vm.recipe) vm.recipe = vm.recipes[0];

        });

        //var infoWindow = new google.maps.InfoWindow();

        vm.sensors = [];
        vm.actuators = [];
        vm.rules = [];
        vm.actions = [];
        vm.mapZoom=17;
        vm.mapCenter = [-21.980892, -47.881379];
        vm.point = icons.point;
        vm.shape = shape;

        NgMap.getMap().then(function(map) {
            vm.map = map;
            var list = sensorsService.getAll();
            list.$loaded()
                .then(function(data) {
                    //vm.sensors = data;
                    //console.log(JSON.stringify(data));
                    vm.sensors = $filter('SensFilter')(data, [{"column": "enabled","value": true}]);
                    vm.rules = vm.rules.concat(loadItems(vm.sensors));

                }, function(error) {
                    console.error("Error:", error);
                });
            var actList = actuatorsService.getAll();
            actList.$loaded()
                .then(function(data) {
                    vm.actuators = $filter('ActFilter')(data, [{"column": "enabled","value": true}]);
                    vm.actions = vm.actions.concat(loadItems(vm.actuators));
                }, function(error) {
                    console.error("Error:", error);
                });

        });


        var item = key;

        vm.submit = function () {

            /*if (item) {
                vm.recipe.$save();
            } else{
                item = recipesService.pushNewItem(vm.recipe);
            }*/

            if (vm.recipe.data.ruleContainer.length < 1){
                var message =  'Necessário ao menos 1 regra completa cadastrada.';
                notifyService.notify('Erro: Regras', message);
                return;
            } else if (vm.recipe.data.actionContainer.length < 1){
                var message =  'Necessário ao menos 1 ação cadastrada.';
                notifyService.notify('Erro: Ações', message);
                return;
            };

            //recipesService.setObject("recipe" , vm.recipe, vm.recipe.$id, $routeParams.type);

            if ($routeParams.type === "edit") {
                vm.recipe.$save();
                var message =  'Receita ' + vm.recipe.data.label + ' foi atualizada.';
                notifyService.notify('Receita atualizada', message);
            } else{
                vm.accessType = vm.isPrivateAccess ? "private": "public";
                item = recipesService.addOne(currentUser, vm.accessType , vm.recipe);
                var message =  'Receita ' + vm.recipe.data.label + ' encontrada.';
                notifyService.notify('Nova receita encontrada', message);
            };
            
            vm.navigateTo("recipes");

        };

        vm.cancel = function () {
            vm.navigateTo("recipes");
        }

        vm.navigateTo = function(key){
            $location.path("/" + key);
        };

        vm.toggleBounce = function() {
            if (this.getAnimation() != null) {
                this.setAnimation(null);
            } else {
                this.setAnimation(google.maps.Animation.BOUNCE);
            }
        };

        vm.selected = null;
        vm.selectedRule = null;
        vm.selectedAction = null;
        vm.searchRuleText = null;
        vm.searchActionText = null;
        vm.selectedActions = [];
        vm.selectedRules = [];

        // Model to JSON for demo purpose
        //$scope.$watch('vm.models', function(model) {
        //    vm.modelAsJson = angular.toJson(model, true);
        //}, true);

        vm.addItem = function(item){if (item.type === 'operador' || item.type === 'separador') vm.recipe.data.max++;};

        vm.removeItem = function(item, index){if (item.type === 'operador' || item.type === 'separador') vm.recipe.data.max--;};

        vm.showConfig = function(ev, item) {
            if (!item || item.type === 'separador' || item.type === 'operador') return;
            vm.selected = item;
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
                },
                parent: angular.element(document.body),
                targetEvent: ev,
                templateUrl: 'app/recipes/config.'+ item.type +'.tmpl.html',
                clickOutsideToClose:true,
                scope: $scope,
                preserveScope: true
            })
            .then(function(result){
                    vm.helpResult = result;
                    vm.selected = "";
                }, function() {
                    vm.helpResult = ' ';
                    vm.selected = "";
                });
        };

        vm.showDetail = function(event, marker) {
            vm.mapCenter = event.latLng;
            vm.selected = vm.sensors[marker];
            vm.map.showInfoWindow('external', this);

        };



        vm.transformChip = transformChip;

        function validateItems(chip) {
            var lastItem = vm.recipe.data.ruleContainer[vm.recipe.data.ruleContainer.length-1];
            //var beforeLastItem = vm.recipe.data.ruleContainer[vm.recipe.data.ruleContainer.length-2];

            if (chip.type !== 'operador' && chip.type !== 'separador'){
                if (vm.recipe.data.ruleContainer.length >= vm.recipe.data.max) return null;
                if (lastItem && lastItem.type !== 'operador' && lastItem.type !== 'separador') return null;

            }else{
                if (!lastItem && chip.type === 'operador') return null;
                if (chip.type === lastItem.type) return null;
                if (chip.type === 'separador' && lastItem.subtype === 'relacional') return null;
                if (lastItem.type === 'separador' && chip.subtype !== 'relacional') return null;
            }

            return chip;
        }

        /**
         * Return the proper object when the append is called.
         */
        function transformChip(chip) {

            if (!validateItems(chip)) return null;

            // If it is an object, it's already a known chip
            if (angular.isObject(chip)) {
                return chip;
            }

            // Otherwise, create a new one
            return { name: 'valor', type: 'valor', icon: "assets/icons/editor/ic_mode_edit_24px.svg", label: chip}
        }


        /**
         * Search for items.
         */
        vm.querySearch = function(query, array) {
            var results = query ? array.filter(createFilterFor(query)) : [];
            return results;
        };

        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(item) {
                return (item._lowername.indexOf(lowercaseQuery) >= 0) ||
                    (item._lowertype.indexOf(lowercaseQuery) >= 0) ||
                    (item._lowersubtype.indexOf(lowercaseQuery) >= 0) ;
            };

        }

        function loadItems(items) {
            return items.filter(function (item) {
                if ('subtype' in item && item.subtype === 'relacional') {
                    return false;
                } else {
                    return true;
                }
            }).map(function (item) {
                item._lowername = item.name.toLowerCase();
                item._lowertype = item.type.toLowerCase();
                item._lowersubtype = item.subtype.toLowerCase();
                item._icon = item.icon;
                return item;
            });
        }

    }

})(angular);
