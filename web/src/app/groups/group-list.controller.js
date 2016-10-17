(function(angular) {
    'use strict';



    angular
        .module('app.groups')
        .controller('SubscriptionsController', SubscriptionsController);


    SubscriptionsController.$inject = ['currentUser', 'CONSTANTS','AlertService', 'GroupsService', 'SubscriptionsService', '$mdDialog', 'ToastService', 'NotifyService'];

    function SubscriptionsController(currentUser, CONSTANTS, alertService, groupsService, subscriptionsService, $mdDialog, toastService, notifyService) {

        var vm = this;

        vm.SCREENCONFIG = CONSTANTS.SCREENCONFIG.GROUPS;

        vm.listItems = {};

        vm.listItems.subscribed = subscriptionsService.getOwn(currentUser);
        vm.listItems.alerts = alertService.getPublic();
        // vm.listItems.groups = groupsService.getPublic();

        vm.subscribe = function (item){
            var ret = vm.listItems.subscribed.$save(vm.listItems.subscribed.$indexFor(item.$id));
        };

        vm.newItem = function(){
            $location.path( "/groups/new");
        };

        vm.navigateTo = function(key, $event){
            $location.path( "/groups/edit/" + key);
        };

    }

})(angular);
