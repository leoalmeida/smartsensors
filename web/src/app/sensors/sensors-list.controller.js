(function(angular) {
  'use strict';


  angular
      .module('app.sensors')
      .controller('SensorListController', SensorListController);

  SensorListController.$inject = ['$scope', 'firebase', 'SensorsInfoService', 'SensorsSocket'];

  function SensorListController($scope, firebase, sensorsService, sensorsSocket) {
    let vm = this;

    vm.title = 'Lista de Sensores';
    vm.sensors = sensorsService.getAll();
    vm.readingPeriod = 1000;
    vm.state = false;

    vm.toggleState = function ($key){
      if (vm.state) sensorsSocket.emit('moisture:on');
      else sensorsSocket.emit('moisture:off');

      vm.state = !vm.state;
      console.log('Sensor '+ vm.state);
    };

    vm.show = function(contact) {
        console.log(contact);
    };

    $scope.ledOn = function () {
        sensorsSocket.emit('led:on');
        console.log('LED ON');
    };
    $scope.ledOff = function () {
        sensorsSocket.emit('led:off');
        console.log('LED OFF');
    };
    $scope.moistureOn = function () {
        sensorsSocket.emit('moisture:on');
        console.log('Moisture ON');
    };
    $scope.moistureOff = function () {
        sensorsSocket.emit('moisture:off');
        console.log('Moisture OFF');
    };

    let storedb = (data) => {
      state = ((((data-vm.lastReading)*100)>1) ||
              (((data-vm.lastReading)*100)<-1)) ;
      if (state) {

      }
    };

    let updateReading = function (id, data, refDB) {
        let status = sensorsService.update(id, data);
        console.log("update  " + status);
    }

    let storeReading = function (data, refDB){
      state = ((((data-vm.lastReading)*100)>1) ||
              (((data-vm.lastReading)*100)<-1)) ;
      if (state) {
        return sensorsService.insert(data);
      }
    }
  };

})(angular);