(function(angular) {
  'use strict';

  angular
      .module('app.sensors')
      .controller('SensorDetailsController', SensorDetailsController);

  SensorDetailsController.$inject = ['$routeParams', 'firebase', 'SensorsInfoService'];

  function SensorDetailsController($routeParams, firebase, sensorsInfoService) {
      var vm = this;
      var key = $routeParams.id;

      vm.analogicpins = ('A0 A1 A2 A3 A4').split(' ').map(function (pin) {
          return {abbrev: pin};
      });
      vm.digitalpins = ('D1 D2 D3 D4 D5 D6 D7 D8 D9 D10 D11 D12 D13').split(' ').map(function (pin) {
          return {abbrev: pin};
      });
      vm.units = ('cm m %').split(' ').map(function (unit) {
          return {abbrev: unit};
      });
      vm.icons = ('motion.svg oscillator.svg').split(' ').map(function (icon) {
          return {abbrev: icon};
      });
      vm.types = ('moisture oscillator').split(' ').map(function (type) {
          return {abbrev: type};
      });
      vm.sensors = sensorsInfoService.getOne(key);

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
