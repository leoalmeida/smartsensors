(function(angular) {
  'use strict';


  angular
      .module('app.actuators')
      .controller('ActuatorListController', ActuatorListController);

  ActuatorListController.$inject = [ 'currentUser', '$location', 'CONSTANTS', 'ActuatorsService', 'SinksService', '$mdDialog'];

  function ActuatorListController(currentUser, $location, CONSTANTS, actuatorsService, sinksService, $mdDialog) {
    var vm = this;

    vm.SCREENCONFIG = CONSTANTS.SCREENCONFIG.ACTUATORS;
    vm.listItems = actuatorsService.getOwn(currentUser);

    vm.readingPeriod = 1000;

    vm.toggleState = function (location, key){
        // if (vm.actuators[$key]) actuatorsSocket.emit('moisture:on');
        // else actuatorsSocket.emit('moisture:off');

        actuatorsService
            .getOne(key)
            .$loaded().then(function (snapshot) {
            snapshot.connected = (snapshot.connected?false:true);
            snapshot.$save();
        });

        //var ret = vm.listItems.$save(item);
    };

    vm.navigateTo = function(sinkKey, key, $event){
        $location.path( "/actuators/public/" + sinkKey + "/edit/" + key );
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
                $location.path( "/actuators/public/" + result + "/new");
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

        /*var confirm = $mdDialog.prompt()
            .clickOutsideToClose(true)
            .title('Novo Atuador')
            .textContent('Escolha um sink')
            .targetEvent(ev)
            .ok('Criar Atuador')
            .cancel('Cancelar')
            .closeTo({
                left: 1500
            });


        $mdDialog.show(confirm).then(function(result){
              vm.newActuator(result.key);
        });
        */
    };
  };

})(angular);
