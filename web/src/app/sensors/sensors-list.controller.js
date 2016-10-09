(function(angular) {
  'use strict';


  angular
      .module('app.sensors')
      .controller('SensorListController', SensorListController);

  SensorListController.$inject = ['currentUser', '$location', 'CONSTANTS', 'SensorsService'];

  function SensorListController(currentUser, $location, CONSTANTS, sensorsService) {
    var vm = this;

    vm.SCREENCONFS = CONSTANTS.SCREENCONFIG.SENSORS;
    vm.listItems = sensorsService.getOwn(currentUser);
    vm.readingPeriod = 1000;

    vm.toggleState = function (item){
        // if (vm.sensors[$key]) sensorsSocket.emit('moisture:on');
        // else sensorsSocket.emit('moisture:off');

        var ret = vm.listItems.$save(vm.listItems.$indexFor(item.$id));
    };

    vm.newSensor = function(){
        $location.path( "/sensors/new");
    };

    vm.navigateTo = function(key, $event){
        $location.path( "/sensors/edit/" + key);
    };

  };

})(angular);
