(function(angular) {
  'use strict';


  angular
      .module('app.sensors')
      .controller('SensorListController', SensorListController);

  SensorListController.$inject = ['currentUser', '$location', 'CONSTANTS', 'SensorsService', '$mdDialog'];

  function SensorListController(currentUser, $location, CONSTANTS, sensorsService, $mdDialog) {
    var vm = this;

    vm.SCREENCONFIG = CONSTANTS.SCREENCONFIG.SENSORS;
    vm.listItems = sensorsService.getOwn(currentUser);

    vm.currentNavItem = -1;
    vm.listItems.$loaded().then(function (snapshot) {
              vm.currentNavItem = 0;
    });

    vm.readingPeriod = 1000;

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

    vm.newServer = function(ev) {

        var confirm = $mdDialog.prompt()
            .clickOutsideToClose(true)
            .title('Novo Servidor')
            .textContent('Digite o nome do novo servidor.')
            .placeholder('Nome do servidor...')
            .targetEvent(ev)
            .ariaLabel('Nome do servidor')
            .ok('Criar Sensor')
            .cancel('Voltar')
            .openFrom({
                top: -50,
                width: 30,
                height: 80
            })
            .closeTo({
                left: 1500
            });

        $mdDialog.show(confirm).then(function(result) {
            vm.newSensor(result);
        });
    };
  };

})(angular);
