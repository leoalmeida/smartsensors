(function(angular) {
    'use strict';

    angular
        .module('app.recipes')
        .controller('RecipeCreatorController', RecipeCreatorController);


    RecipeCreatorController.$inject = ['$scope', '$timeout', '$routeParams', 'CONSTANTS', 'SensorsService', 'RecipesService'];


    function RecipeCreatorController($scope, $timeout, $routeParams, CONSTANTS, sensorsService, recipesService) {
        var vm = this;
        var key = $routeParams.id;

        vm.SCREENCONFIG = CONSTANTS.SCREENCONFIG.RECIPES;

        if ($routeParams.type === "edit") {
            vm.activity = "Alterar Receita";
            vm.recipe = {};
            vm.recipe = recipesService.getOne(key);

            vm.recipe.$loaded().then(function(x) {

            }, function (errorObject) {
                console.log("The read failed: " + errorObject.code);
                return errorObject;
            });

        } else {
            vm.activity = "Nova Receita";
            vm.recipe = {};
            vm.recipe.enabled = false;
        }

        var item = vm.recipe.$id;

        vm.submit = function () {

            if (item) {
                vm.recipe.$save();
            } else{
                item = recipesService.pushNewItem(vm.recipe);
            }

        };

        vm.configurations = sensorsService.getAllConfigurations();
        vm.configurations.$loaded().then(function(snapshot) {
            vm.analogicpins = snapshot.analogicpins;
            vm.digitalpins = snapshot.digitalpins;
            vm.units = snapshot.units;
            vm.icons = snapshot.icons;
            vm.types = snapshot.types;
            vm.states = snapshot.states;
            vm.countries = snapshot.country;
            vm.addressTypes = snapshot.addressTypes;
            vm.localTypes = snapshot.localTypes;
        });

        vm.sensors = sensorsService.getAll();
        vm.selected = null;
        vm.actions = {"actions": [{"and": {icon: "assets/icons/social/ic_share_24px.svg"}}, {"or": {"icon": "assets/icons/action/ic_account_balance_24px.svg"}}]};
        vm.recipe = {"sensors": []};



        vm.hidden = false;
        vm.isOpen = false;
        vm.hover = false;

        // On opening, add a delayed property which shows tooltips after the speed dial has opened
        // so that they have the proper position; if closing, immediately hide the tooltips
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
        $scope.$watch('vm.selected', function(model) {
            vm.modelAsJson = angular.toJson(model, true);
        }, true);
    }

})(angular);
