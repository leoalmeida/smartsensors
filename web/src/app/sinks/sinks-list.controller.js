(function(angular) {
  'use strict';

  angular
      .module('app.sinks')
      .controller('SinkListController', SinkListController);

  SinkListController.$inject = ['currentUser', '$location', 'CONSTANTS', 'SinksService', 'ActuatorsService','SensorsService', '$mdDialog', '$interval', 'apisDataService'];

  function SinkListController(currentUser, $location, CONSTANTS, sinksService, actuatorsService, sensorsService, $mdDialog, $interval, apisDataService) {
    var vm = this;
    var alert;

    vm.working = function() { return (!!alert) };

    vm.SCREENCONFIG = CONSTANTS.SCREENCONFIG.SINKS;
    vm.ICONS = CONSTANTS.ICONS;
    //vm.listItems = sinksService.getOwn(currentUser);

      //{"atype": "", "atype_objid": "", "atype_objid2": "", "data": "", "objid": "", "objid2": "", "time": 1477327375744}

      vm.sinkList = [];
      vm.sensorListItems = [];
      vm.actuatorListItems = [];
      vm.listItems = [];
      
      apisDataService.getDataInfo(["association",currentUser.uid,"own"])
      		.then(function(result) {
      			console.log(result); // "Stuff worked!"
      			for (let item of result.filter(function(n){ return n != undefined })){
      				if (item.data.type === 'sensor')
      					vm.sensorListItems.push(item);
      				else if (item.data.type === 'actuator')
      					vm.actuatorListItems.push(item);
      				else {
      					apisDataService.getDataInfo(["object", item.objid2])
      						.then(function(result) {
      							var keyvalye = Object.entries(result);
      							console.log(keyvalye);
      							vm.sinkList[keyvalye[0][0]]= keyvalye[0][1];
      						});
      					vm.listItems.push(item);
      				}
      			}
  //    			vm.currentNavItem = 0;
//      			vm.getEquipmentsFromSink(vm.currentNavItem);
      		}, function(err) {
      			console.log(err); // Error: "It broke"
      		});
      		

//      vm.listItems = sinksService.getOwnSinks("own", currentUser.uid, true );

      vm.currentNavItem = -1;

      /*vm.listItems.$watch(function (data) {
          if (data.event === 'child_added') {
              sinksService.getObject(data.key).$loaded().then(function (data) {
                    if (data.otype === 'sensor')
                        vm.sensorListItems.push(data);
                    else if (data.otype === 'actuator')
                        vm.actuatorListItems.push(data);
                    else vm.sinkList.push(data);
              });
          }
      });*/

    vm.readingPeriod = 1000;
    vm.sinkMessage = "Processando solicitação";

    vm.getEquipmentsFromSink = function (sinkID){
    	apisDataService.getDataInfo(["association",vm.sinkList[sinkID].objid2,"connected"])
      					.then(function(result) {
	      					console.log(result); // "Stuff worked!"
      					  	vm.connectedItems = result;
      					}, function(err) {
						    console.log(err); // Error: "It broke"
						});
        //vm.connectedItems = sinksService.getAssociations("connected", vm.sinkList[sinkID].objid, true);
        //vm.connectedItems.$loaded().then(function (snapshot) {
        //  vm.teste = 0;
        //});

        /*vm.sensorListItems = sensorsService.getFromSink(vm.listItems[sinkID].$id);
        vm.actuatorListItems = actuatorsService.getFromSink(vm.listItems[sinkID].$id);
        vm.actuatorListItems.$loaded().then(function (snapshot) {
          vm.teste = 0;
        });*/
    };

    vm.toggleState = function (location, key){
        // if (vm.sinks[$key]) sinksSocket.emit('moisture:on');
        // else sinksSocket.emit('moisture:off');

        sinksService
            .getOne("public", currentUser, location, key)
            .$loaded().then(function (snapshot) {
            snapshot.connected = (snapshot.connected?false:true);
            snapshot.$save();
        });

        //var ret = vm.listItems.$save(item);
    };
    vm.toggleEnabled = function (location, key){
        sinksService
            .getOne("public", currentUser, location, key)
            .$loaded().then(function (snapshot) {
                snapshot.enabled = (snapshot.enabled?false:true);
                snapshot.$save();
            });
    };

    vm.navigateTo = function(equipmentType, equipmentID, key, $event){
        $location.path( "/" + equipmentType + "/public/" + equipmentID + "/edit/" + key);
    };

    vm.newSink = function(ev) {

        var confirm = $mdDialog.prompt()
            .clickOutsideToClose(true)
            .title('Novo Sink')
            .textContent('Digite o nome do novo sink.')
            .placeholder('Nome do sink...')
            .targetEvent(ev)
            .ariaLabel('Nome do sink')
            .ok('Criar Sink')
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
            sink: vm.listItems[currentNavItem].$id,
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
        alert = sinksService.startBoard({
            ip: vm.hostip,
            port: vm.hostport,
            email: currentUser.email,
            sink: vm.sinkList[vm.currentNavItem].objid,
            serialport: ""
        }, cbStartBoardSuccess, cbStartBoardError);
    };

    let cbStartBoardSuccess = function () {
        console.log("Placa iniciada com sucesso");
        vm.sinkMessage = "Placa iniciada com sucesso";
        alert = undefined;
    };

    let cbStartBoardError = function (data) {
        console.log("Erro ao iniciar placa");
        vm.sinkMessage = "Erro ao iniciar placa";
        alert = undefined;
    };
/*
    socket.on('reconnect', function () {
        console.log("true");
        //vm.recordObservation('Motion Data', 'Reco');
    });
    socket.on('sinksData', function(data){

        var sinks = JSON.parse(data);
        for (sink of Object.keys(sinks)) {
            vm.sinkList.push(sinks[sink]);
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
