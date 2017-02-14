(function(angular) {
  'use strict';


  angular
      .module('app.servers')
      .controller('ServerListController', ServerListController);

  ServerListController.$inject = ['currentUser', '$location', 'CONSTANTS', 'ServersService', 'ActuatorsService','SensorsService', '$mdDialog'];

  function ServerListController(currentUser, $location, CONSTANTS, serversService, actuatorsService, sensorsService, $mdDialog) {
    var vm = this;

    vm.SCREENCONFIG = CONSTANTS.SCREENCONFIG.SERVERS;
    vm.listItems = serversService.getOwn(currentUser);

    vm.currentNavItem = -1;
    vm.listItems.$loaded().then(function (snapshot) {
              vm.currentNavItem = 0;
              vm.getEquipmentsFromServer(vm.currentNavItem);
    });

    vm.readingPeriod = 1000;

    vm.getEquipmentsFromServer = function (serverID){
        vm.sensorListItems = sensorsService.getFromServer(vm.listItems[serverID].$id);
        vm.actuatorListItems = actuatorsService.getFromServer(vm.listItems[serverID].$id);
        vm.actuatorListItems.$loaded().then(function (snapshot) {
          vm.teste = 0;
        });
    };

    vm.toggleState = function (location, key){
        // if (vm.servers[$key]) serversSocket.emit('moisture:on');
        // else serversSocket.emit('moisture:off');

        serversService
            .getOne("public", currentUser, location, key)
            .$loaded().then(function (snapshot) {
            snapshot.connected = (snapshot.connected?false:true);
            snapshot.$save();
        });

        //var ret = vm.listItems.$save(item);
    };
    vm.toggleEnabled = function (location, key){
        serversService
            .getOne("public", currentUser, location, key)
            .$loaded().then(function (snapshot) {
                snapshot.enabled = (snapshot.enabled?false:true);
                snapshot.$save();
            });
    };

    vm.navigateTo = function(equipmentType, equipmentID, key, $event){
        $location.path( "/" + equipmentType + "/public/" + equipmentID + "/edit/" + key);
    };

    vm.newServer = function(ev) {

        var confirm = $mdDialog.prompt()
            .clickOutsideToClose(true)
            .title('Novo Servidor')
            .textContent('Digite o nome do novo servidor.')
            .placeholder('Nome do servidor...')
            .targetEvent(ev)
            .ariaLabel('Nome do servidor')
            .ok('Criar Server')
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
            vm.listItems.$add({"enabled": true, "connected": false, "id": result, "owner": currentUser.uid});
        });
    };
  };

})(angular);
