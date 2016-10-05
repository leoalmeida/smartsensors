(function(angular) {
    'use strict';



    angular
        .module('app.alerts')
        .controller('AlertController', AlertController);


    AlertController.$inject = ['$scope', 'CONSTANTS','AlertService', '$mdDialog', 'ToastService', 'NotifyService'];

    function AlertController($scope, CONSTANTS, alertService, $mdDialog, toastService, notifyService) {

        var vm = this;

        vm.SCREENCONFS = CONSTANTS.SCREENCONFIG.ALERTS;

        vm.listItems = alertService.getAll();

        vm.save = function(alert) {
            alertService.save(alert)
                .then(function(resp) {
                    console.log(resp);
                })
                .catch(function(err) {
                    console.log(err);
                });
        };

        vm.toggleState = function (item){
            var ret = vm.listItems.$save(vm.listItems.$indexFor(item.$id));
        };


        vm.newItem = function(){
            $location.path( "/alerts/new");
        };

        vm.navigateTo = function(key, $event){
            $location.path( "/alerts/edit/" + key);
        };

    }

})(angular);
