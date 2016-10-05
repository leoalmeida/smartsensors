(function(angular) {
    'use strict';



    angular
        .module('app.groups')
        .controller('GroupsController', GroupsController);


    GroupsController.$inject = ['$scope', 'CONSTANTS','AlertService', 'FriendsService', 'GroupsService', '$mdDialog', 'ToastService', 'NotifyService'];

    function GroupsController($scope, CONSTANTS, alertService, friendsService, groupsService, $mdDialog, toastService, notifyService) {

        var vm = this;

        vm.SCREENCONFS = CONSTANTS.SCREENCONFIG.GROUPS;

        vm.listItems = {};

        vm.listItems.subscribed = groupsService.getAll();
        vm.listItems.alerts = alertService.getAll();
        vm.listItems.groups = friendsService.getAll();

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
