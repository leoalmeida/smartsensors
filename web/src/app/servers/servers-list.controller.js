(function(angular) {
  'use strict';


  angular
      .module('app.servers')
      .controller('ServerListController', ServerListController);

  ServerListController.$inject = ['currentUser', '$location', 'CONSTANTS', 'ServersService', '$mdDialog'];

  function ServerListController(currentUser, $location, CONSTANTS, serversService, $mdDialog) {
    var vm = this;

    vm.SCREENCONFIG = CONSTANTS.SCREENCONFIG.SERVERS;
    vm.listItems = serversService.getOwn(currentUser);

    vm.currentNavItem = -1;
    vm.listItems.$loaded().then(function (snapshot) {
              vm.currentNavItem = 0;
    });

    vm.readingPeriod = 1000;

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

    vm.navigateTo = function(serverID, key, $event){
        $location.path( "/servers/public/" + serverID + "/edit/" + key);
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
            vm.listItems.$add({"connected": false, "id": result, "owner": currentUser.uid});
        });
    };
  };

})(angular);
