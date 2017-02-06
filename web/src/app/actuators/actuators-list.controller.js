(function(angular) {
  'use strict';


  angular
      .module('app.actuators')
      .controller('ActuatorListController', ActuatorListController);

  ActuatorListController.$inject = ['currentUser', '$location', 'CONSTANTS', 'ActuatorsService', 'ServersService', '$mdDialog'];

  function ActuatorListController(currentUser, $location, CONSTANTS, actuatorsService, serversService, $mdDialog) {
    var vm = this;

    vm.SCREENCONFIG = CONSTANTS.SCREENCONFIG.ACTUATORS;
    vm.listItems = actuatorsService.getOwn(currentUser);

    vm.currentNavItem = -1;
    vm.listServers = serversService.getOwn(currentUser);

    vm.listServers.$loaded().then(function (snapshot) {
        vm.currentNavItem = 0;
    });

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

    vm.newActuator = function(serverID){
        $location.path( "/actuators/public/" + serverID + "/new");
    };

    vm.navigateTo = function(serverID, key, $event){
        $location.path( "/actuators/public/" + serverID + "/edit/" + key );
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
