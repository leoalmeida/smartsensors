(function(angular) {
  'use strict';

  let five = require("johnny-five");
  let readingPeriod = process.argv[2] || 1000;


  angular
      .module('app.sensors')
      .controller('ProximityController', ProximityController);

    ProximityController.$inject = ['$scope', 'firebase', 'ReadingsService'];

    function ProximityController($scope, firebase, readingsService) {
      let vm = this;
      vm.messages = [];
      let board = new five.Board();

      board.on("ready", function() {
        var proximity = new five.Proximity({
          controller: "HCSR04",
          pin: 7
        });

        proximity.on("data", function() {
          console.log("Proximity: ");
          console.log("  cm  : ", this.cm);
          console.log("  in  : ", this.in);
          console.log("-----------------");
        });

        proximity.on("change", function() {
          console.log("The obstruction has moved.");
        });
      });
    };

  })(angular);