(function(angular) {
  'use strict';


  angular
      .module('app.sensors')
      .controller('SensorListController', SensorListController);

  SensorListController.$inject = ['currentUser', '$location', 'CONSTANTS', 'SensorsService', '$mdDialog'];

  function SensorListController(currentUser, $location, CONSTANTS, sensorsService, $mdDialog) {
    var vm = this;

    vm.SCREENCONFS = CONSTANTS.SCREENCONFIG.SENSORS;
    vm.listItems = sensorsService.getOwn(currentUser);

    vm.readingPeriod = 1000;

    vm.testfilter = function (item){
      vm.teste = "teste"
    }

    vm.toggleState = function (item){
        // if (vm.sensors[$key]) sensorsSocket.emit('moisture:on');
        // else sensorsSocket.emit('moisture:off');

        var ret = vm.listItems.$save(vm.listItems.$indexFor(item));
    };

    vm.newSensor = function(serverID){
        $location.path( "/sensors/public/" + serverID + "/new");
    };

    vm.navigateTo = function(serverID, key, $event){
        $location.path( "/sensors/public/" + serverID + "/edit/" + key);
    };

  };

})(angular);
