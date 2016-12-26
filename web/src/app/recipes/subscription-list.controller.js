(function(angular) {
    'use strict';



    angular
        .module('app.groups')
        .controller('SubscriptionsController', SubscriptionsController);


    SubscriptionsController.$inject = ['currentUser', 'CONSTANTS','AlertService', 'GroupsService', 'SubscriptionsService', '$mdDialog', 'ToastService', 'NotifyService', '$filter'];

    function SubscriptionsController(currentUser, CONSTANTS, alertService, groupsService, subscriptionsService, $mdDialog, toastService, notifyService, $filter) {

        var vm = this;

        vm.helpResult = '  ';
        vm.customFullscreen = false;

        vm.anyalerts = vm.anygroups = true;

        vm.SCREENCONFIG = CONSTANTS.SCREENCONFIG.SUBSCRIPTIONS;

        vm.listItems = {};
        vm.listItems.subscribed = subscriptionsService.getOwn(currentUser);
        vm.listItems.alerts = [];

        vm.listItems.alerts = alertService.getPublic();

        //vm.listItems.groups = groupsService.getPublic();

        vm.toggleState = function (item){
            var ret = vm.listItems.subscribed.$save(vm.listItems.subscribed.$indexFor(item.$id));
        };

        vm.subscribeToAlert = function (item){
            var newItem = {
                avatar: item.configurations.localization.image,
                description: item.configurations.type,
                id: item.$id,
                name: item.configurations.name,
                owner: item.configurations.owner,
                startDate: item.startDate,
                status: true,
                subscribeDate: new Date().toLocaleString(),
                type: "alert"
            };

            vm.listItems.subscribed.$add(newItem);
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

            vm.listItems.subscribed.$add(newItem);
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
