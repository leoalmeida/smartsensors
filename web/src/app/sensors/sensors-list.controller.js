(function(angular) {
  'use strict';


  angular
      .module('app.sensors')
      .controller('SensorListController', SensorListController);

  SensorListController.$inject = ['currentUser', '$location', 'CONSTANTS', 'SensorsService', 'SinksService', '$mdDialog'];

  function SensorListController(currentUser, $location, CONSTANTS, sensorsService, sinksService, $mdDialog) {
    var vm = this;

    vm.SCREENCONFIG = CONSTANTS.SCREENCONFIG.SENSORS;
    vm.listItems = sensorsService.getOwn(currentUser);

    vm.readingPeriod = 1000;

    vm.toggleState = function (location, key){
        // if (vm.sensors[$key]) sensorsSocket.emit('moisture:on');
        // else sensorsSocket.emit('moisture:off');

        sensorsService
            .getOne(key)
            .$loaded().then(function (snapshot) {
            snapshot.connected = (snapshot.connected?false:true);
            snapshot.$save();
        });

        //var ret = vm.listItems.$save(item);
    };

    vm.navigateTo = function(sinkKey, key, $event){
        $location.path( "/sensors/public/" + sinkKey + "/edit/" + key );
    };

    vm.chooseSink = function($event) {

        vm.listValues = sinksService.getOwn(currentUser);

        vm.listValues.$loaded().then(function(snapshot){
          $mdDialog.show({
              controller: DialogController,
              parent: angular.element(document.body),
              targetEvent: $event,
              templateUrl: 'app/core/layouts/select-sink.dialog.templ.html',
              clickOutsideToClose: true,
              locals: {
                items: snapshot
              },
              preserveScope: true,
              closeTo: {left: 1500}
          }).then(function(result){
                $location.path( "/sensors/public/" + result + "/new");
          });
          function DialogController($scope, $mdDialog, items) {
              $scope.items = items;
              $scope.hide = function() {
                  $mdDialog.hide();
              };
              $scope.close = function(result) {
                  $mdDialog.hide(result);
              }
              $scope.cancel = function() {
                  $mdDialog.cancel();
              };
            };
        });
    };
  };

})(angular);
