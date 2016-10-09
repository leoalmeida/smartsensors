(function(angular) {
    'use strict';



    angular
        .module('app.alerts')
        .controller('AlertController', AlertController);


    AlertController.$inject = ['$scope', 'currentUser', 'CONSTANTS','AlertService', '$mdDialog', 'ToastService', 'NotifyService'];

    function AlertController($scope, currentUser, CONSTANTS, alertService, $mdDialog, toastService, notifyService) {

        var vm = this;

        vm.SCREENCONFS = CONSTANTS.SCREENCONFIG.ALERTS;

        vm.listItems = alertService.getOwn(currentUser);

        vm.toggleState = function (item){
            var ret = vm.listItems.$save(vm.listItems.$indexFor(item.$id));
        };

        vm.subscribersQty = function (item){
            return Object.keys(item).length;
        }

        vm.newItem = function(){
            $location.path( "/alerts/new");
        };

        vm.navigateTo = function(key, $event){
            $location.path( "/alerts/edit/" + key);
        };

    }

})(angular);
