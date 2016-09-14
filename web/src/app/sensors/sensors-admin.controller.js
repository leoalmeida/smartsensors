(function(angular) {
  'use strict';

  angular
      .module('app.sensors')
      .controller('SensorAdminController', SensorAdminController);

  SensorAdminController.$inject = ['$scope', 'firebase', 'ReadingsService'];

  function SensorAdminController($scope, firebase, readingsService) {
    var vm = this;
    vm.messages = [];
  };

  })(angular);
