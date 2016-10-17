(function(angular) {
    'use strict';



    angular
        .module('app.recipes')
        .controller('RecipesController', RecipesController);


    RecipesController.$inject = ['$location', 'currentUser', 'CONSTANTS','RecipesService', '$mdDialog', 'ToastService', 'NotifyService'];

    function RecipesController($location, currentUser, CONSTANTS, recipesService, $mdDialog, toastService, notifyService) {

        var vm = this;

        vm.SCREENCONFIG = CONSTANTS.SCREENCONFIG.RECIPES;

        vm.listItems = recipesService.getAll();

        vm.toggleState = function (item){
            var ret = vm.listItems.$save(vm.listItems.$indexFor(item.$id));
        };

        vm.subscribersQty = function (item){
            return Object.keys(item).length;
        }

        vm.newItem = function(){
            $location.path( "/recipes/public/new");
        };

        vm.navigateTo = function(key, $event){
            $location.path( "/recipes/public/edit/" + key);
        };

    }

})(angular);
