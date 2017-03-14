(function(angular) {
    'use strict';

    angular
        .module('app.recipes')
        .controller('RecipesController', RecipesController);


    RecipesController.$inject = ['$location', 'currentUser', 'CONSTANTS','RecipesService', '$mdDialog', 'ToastService', 'NotifyService'];

    function RecipesController($location, currentUser, CONSTANTS, recipesService, $mdDialog, toastService, notifyService) {

        var vm = this;

        vm.helpResult = '  ';

        vm.SCREENCONFIG = CONSTANTS.SCREENCONFIG.RECIPES;
        vm.ICONS = CONSTANTS.ICONS;

        vm.listItems = recipesService.getPublicRecipes();
        //vm.listItems = recipesService.getPublic();
        //vm.listItems = recipesService.getOwn(currentUser);

        vm.currentNavItem = -1;
        vm.listItems.$loaded().then(function (snapshot) {
            vm.currentNavItem = 0;
        });

        vm.toggleState = function (item){
            var ret = vm.listItems.$save(vm.listItems.$indexFor(item.$id));
        };

        vm.subscribersQty = function (item){
            if (!item) return 0;
            return Object.keys(item).length;
        }

        vm.newItem = function(){
            $location.path( "/recipes/public/new");
        };

        vm.navigateTo = function(key, $event){
            $location.path( "/recipes/public/edit/" + key);
        };


        vm.showHelp = function(ev) {
            $mdDialog.show({
                controller: HelpController,
                templateUrl: 'app/recipes/help.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: vm.customFullscreen // Only for -xs, -sm breakpoints.
            })
                .then(function(answer) {
                    vm.helpResult = 'A informação foi "' + answer + '".';
                }, function() {
                    vm.helpResult = 'Cancelado.';
                });
        };

        function HelpController($scope, $mdDialog) {
            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };
        }


    }

})(angular);
