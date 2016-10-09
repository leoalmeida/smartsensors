(function(angular) {
    'use strict';



    angular
        .module('app.groups')
        .controller('SubscriptionsController', SubscriptionsController);


    SubscriptionsController.$inject = ['currentUser', 'CONSTANTS','AlertService', 'GroupsService', 'SubscriptionsService', '$mdDialog', 'ToastService', 'NotifyService', '$filter'];

    function SubscriptionsController(currentUser, CONSTANTS, alertService, groupsService, subscriptionsService, $mdDialog, toastService, notifyService, $filter) {

        var vm = this;

        vm.anyalerts = vm.anygroups = true;

        vm.SCREENCONFS = CONSTANTS.SCREENCONFIG.GROUPS;

        vm.listItems = {};

        vm.listItems.subscribed = subscriptionsService.getOwn(currentUser);
        vm.listItems.alerts = alertService.getPublic();
        vm.listItems.groups = groupsService.getPublic();


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

    }

})(angular);
