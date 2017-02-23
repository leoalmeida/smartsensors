(function(angular) {
  'use strict';

  angular
      .module('app.servers')
      .controller('ServerListController', ServerListController);

  ServerListController.$inject = ['currentUser', '$location', 'CONSTANTS', 'ServersService', 'ActuatorsService','SensorsService', '$mdDialog', '$interval'];

  function ServerListController(currentUser, $location, CONSTANTS, serversService, actuatorsService, sensorsService, $mdDialog, $interval) {
    var vm = this;
    var alert;

    vm.working = function() { return (!!alert) };

    vm.SCREENCONFIG = CONSTANTS.SCREENCONFIG.SERVERS;
    vm.ICONS = CONSTANTS.ICONS;
    vm.listItems = serversService.getOwn(currentUser);

    vm.currentNavItem = -1;
    vm.listItems.$loaded().then(function (snapshot) {
              vm.currentNavItem = 0;
              vm.getEquipmentsFromServer(vm.currentNavItem);
    });

    vm.readingPeriod = 1000;
    vm.serverMessage = "Processando solicitação";

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

    vm.btnStartClick = function ($event, currentNavItem) {
        /*(
        socket.emit("startBoard", JSON.stringify({
            ip: vm.hostip,
            port: vm.hostport,
            email: currentUser.email,
            server: vm.listItems[currentNavItem].$id,
            serialport: ""
        }));
        */

        /*$mdDialog.show({
            controller: WaitController,
            parent: angular.element(document.body),
            targetEvent: $event,
            templateUrl: 'app/core/layouts/wait.dialog.templ.html',
            clickOutsideToClose: false,
            openFrom: {
                top: -50,
                width: 30,
                height: 80
            },
            closeTo: {
                left: 1500
            }
        });

        function WaitController($scope, $mdDialog) {
            $scope.hide = function() {vm.status = 'Processado com sucesso.'};
            $scope.close = function(result) {$mdDialog.hide(result)};
            $scope.cancel = function() {vm.status = 'You cancelled the dialog.'};
        };
        */
        alert = serversService.startBoard({
            ip: vm.hostip,
            port: vm.hostport,
            email: currentUser.email,
            server: vm.listItems[currentNavItem].$id,
            serialport: ""
        }, cbStartBoardSuccess, cbStartBoardError);
    };

    let cbStartBoardSuccess = function () {
        console.log("Placa iniciada com sucesso");
        vm.serverMessage = "Placa iniciada com sucesso";
        alert = undefined;
    };

    let cbStartBoardError = function (data) {
        console.log("Erro ao iniciar placa");
        vm.serverMessage = "Erro ao iniciar placa";
        alert = undefined;
    };
/*
    socket.on('reconnect', function () {
        console.log("true");
        //vm.recordObservation('Motion Data', 'Reco');
    });
    socket.on('serversData', function(data){

        var servers = JSON.parse(data);
        for (server of Object.keys(servers)) {
            vm.serverList.push(servers[server]);
        }

    });
    socket.on('motionData', function(data){vm.socketStatus('Motion Data: ' + data)});
    socket.on('hygrometerData', function(data){vm.socketStatus('Hygrometer Data: ' + data)});
    socket.on('thermometerData', function(data){vm.socketStatus('Temp Data: ' + data)});
    socket.on('flowData', function(data){vm.socketStatus('Flow Data: ' + data)});
    socket.on('lightData', function(data){vm.socketStatus('Light Data: ' + data)});
    socket.on('sensorData', function(data){vm.socketStatus('Sensor Data: ' + data)});

*/
  };

})(angular);
