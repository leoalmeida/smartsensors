(function(angular) {
  'use strict';


  angular
      .module('app.sensors')
      .controller('SensorListController', SensorListController);

  SensorListController.$inject = ['currentUser', '$location', 'CONSTANTS', 'SensorsService', 'ServersService', '$mdDialog'];

  function SensorListController(currentUser, $location, CONSTANTS, sensorsService, serversService, $mdDialog) {
    var vm = this;

    vm.SCREENCONFIG = CONSTANTS.SCREENCONFIG.SENSORS;
    vm.listItems = sensorsService.getOwn(currentUser);
    vm.currentNavItem = -1;

    vm.listServers = serversService.getOwn(currentUser);
    vm.listServers.$loaded().then(function (snapshot) {
          vm.currentNavItem = 0;
    });

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

    vm.newSensor = function(serverKey){
        $location.path( "/sensors/public/" + serverKey + "/new");
    };

    vm.navigateTo = function(serverKey, key, $event){
        $location.path( "/sensors/public/" + serverKey + "/edit/" + key );
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
            serversService.addOne({"enabled": true, "connected": false, "id": result, "owner": currentUser.uid})
                .then(function(ref) {
                    vm.newSensor(ref.key);
                });
        });
    };
  };

})(angular);
