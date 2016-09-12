(function(angular) {
  'use strict';

  let five = require("johnny-five");
  let readingPeriod = process.argv[2] || 1000;


  angular
      .module('app.sensors')
      .controller('MoistureController', MoistureController);



  MoistureController.$inject = ['$scope', 'firebase', 'ReadingsService', 'SensorsSocket'];

  function MoistureController($scope, firebase, readingsService, 'sensorsSocket') {
    let vm = this;
    vm.messages = [];
    let board = new five.Board();

    vm.initReadings = function() {
        vm.title = 'Moisture';

        readingsService.getAll().$loaded().then(function (snapshot) {
            vm.messages.push.apply(vm.messages, snapshot.val());
            $scope.$apply();
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
    };
    vm.state = false;
    vm.toggleState($key){
      if (vm.state) sensorsSocket.emit('moisture:on');
      else sensorsSocket.emit('moisture:off');

      vm.state = !vm.state;
      console.log('Sensor '+ vm.state);
    }

    vm.show = function(contact) {
        console.log(contact);
    };

    board.on("ready", function() {
      vm.messages.push("Connected");

      let sensorReader = new five.Sensor({
        pin: "A0",
        enabled: false
      });
      let sensorControl = new five.Pin(13);

      sensorReader.on("data", function() {
        if (sensorControl.isHigh) {
          vm.actualReading = ((1024-this.value)*100)/1024;
          this.storedb(vm.actualReading);

          vm.messages.push("Moisture: " + vm.actualReading);
          sensorControl.low();
          sensorReader.disable();
        }
      });

      sensorReader.on("change", function() {
          vm.messages.push("The reading value has changed.");
      });

      this.loop(readingPeriod, function() {
        if (!sensorControl.isHigh) {
          sensorControl.high();
          sensorReader.enable();
        }
      });

    });

    let storedb = (data) => {
      state = ((((data-vm.lastReading)*100)>1) ||
              (((data-vm.lastReading)*100)<-1)) ;
      if (state) {

      }
    };

    let updateReading = function (id, data, refDB) {
        let status = readingsService.update(id, data);
        console.log("update  " + status);
    }

    let storeReading = function (data, refDB){
      state = ((((data-vm.lastReading)*100)>1) ||
              (((data-vm.lastReading)*100)<-1)) ;
      if (state) {
        return readingsService.insert(data);
      }
    }
  };

})(angular);
