(function(angular) {
    'use strict';



    angular
        .module('app.groups')
        .controller('SubscriptionsController', SubscriptionsController);


    SubscriptionsController.$inject = ['currentUser', 'CONSTANTS','RecipesService', 'GroupsService', 'SubscriptionsService', '$mdDialog', 'ToastService', 'NotifyService', '$filter'];

    function SubscriptionsController(currentUser, CONSTANTS, recipesService, groupsService, subscriptionsService, $mdDialog, toastService, notifyService, $filter) {

        var vm = this;

        vm.helpResult = '  ';
        vm.customFullscreen = false;

        vm.anyrecipes = true;
        vm.anygroups = true;

        vm.SCREENCONFIG = CONSTANTS.SCREENCONFIG.SUBSCRIPTIONS;
        vm.RANDOMCOLOR = CONSTANTS.SCREENCONFIG.RANDOMCOLOR;
        vm.RANDOMSPAN = CONSTANTS.SCREENCONFIG.RANDOMSPAN;

        vm.listItems = {};
        vm.listItems.subscribed = subscriptionsService.getOwn(currentUser);
        vm.listItems.recipes = [];

        vm.listItems.recipes = recipesService.getPublic();

        //vm.listItems.groups = groupsService.getPublic();

        vm.toggleState = function (item){
            vm.listItems.subscribed.$save(vm.listItems.subscribed.$indexFor(item.$id));

            if (item.status)
                vm.listItems.recipes[item.$id].subscribers.push(currentUser.uid);
            else
                vm.listItems.recipes[item.$id].subscribers.splice(vm.listItems.recipes[item.$id].subscribers.indexOf(currentUser.uid), 1);

            vm.listItems.recipes.$save(item.$id);
        };

        vm.subscribeToRecipe = function (item){
            var newItem = {
                catalogImage: item.image,
                id: item.$id,
                startDate: item.startDate,
                status: true,
                subscribeDate: new Date().toLocaleString(),
                type: "recipe"
            };

            subscriptionsService.addOne(currentUser, newItem);
            vm.toggleState(item);
            notifyService.notify('Nova assinatura realizada', newItem.name);
        };

        vm.subscribeToGroup = function (item){
            var newItem = {
                avatar: item.avatar,
                description: item.description,
                id: item.$id,
                name: item.name,
                owner: item.owner,
                startDate: item.startDate,
                status: true,
                subscribeDate: new Date().toLocaleString(),
                type: "messenger"
            };

            subscriptionsService.addOne(currentUser, newItem);
            //vm.listItems.subscribed.$add(newItem);
        };

        vm.newItem = function(){
            $location.path( "/groups/new");
        };

        vm.navigateTo = function(key, $event){
            $location.path( "/groups/edit/" + key);
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
