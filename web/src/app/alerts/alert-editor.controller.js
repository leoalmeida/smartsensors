(function(angular) {
    'use strict';

    angular
        .module('app.alerts')
        .controller('AlertCreatorController', AlertCreatorController);


    AlertCreatorController.$inject = ['$routeParams', 'SensorsInfoService', 'AlertService'];


    function AlertCreatorController($routeParams, sensorsService, alertService) {
        var vm = this;
        var key = $routeParams.id;

        vm.currentNavItem = 'main';

        if ($routeParams.type === "edit") {
            vm.activity = "Alterar Sensor";
            vm.sensor = sensorsService.getOne(key);
        } else {
            vm.activity = "Novo Sensor";
            vm.sensor = {};
        }

        var item = vm.sensor.$id;

        vm.submit = function () {

            if (item) {
                vm.sensor.$save();
            } else{
                item = sensorsService.pushNewItem(vm.sensor);
            }

        };

        vm.localization = function() {
            vm.syncObject = alertService.getAll();


            vm.syncObject.$loaded().then(function(snapshot) {
                vm.alertItems.push.apply(vm.alertItems, snapshot);
                return vm.addMarkers(snapshot);
            }, function (errorObject) {
                console.log("The read failed: " + errorObject.code);
                return errorObject;
            });
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

        /*vm.sensor = {
         alert: false,
         configurations: {
         analogic: {pin: 'A0', threshold: 5},
         digital: {pin: 'D13'},
         loop: 1000, max: 85, min: 65,
         model: 'YL-96', unit: '%'
         },
         enabled: true,
         icon: 'motion.svg',
         label: 'P0',
         name: 'Moisture',
         readings: {},
         type: 'moisture'
         };*/
    }

})(angular);
