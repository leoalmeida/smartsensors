(function(angular) {
    'use strict';



    angular
        .module('app.home')
        .controller('HomeController', HomeController);


    HomeController.$inject = ['$scope','AlertService', '$mdDialog', 'ToastService', 'NotifyService'];

    function HomeController($scope, alertService, $mdDialog, toastService, notifyService) {

        var vm = this;

        vm.alertItems = alertService.getAll();

        function buildGridModel(tileImpl){
            var it, results = [ ];
            for (var j=0; j < tileImpl.length; j++) {
                it = angular.extend({},tileImpl[j]);

                it.tile.span  = { row : 1, col : 1};
                it.tile.background = "red";

                switch(j+1%11) {
                    case 1: it.tile.background = "red";           break;
                    case 2: it.tile.background = "green";         break;
                    case 3: it.tile.background = "darkBlue";      break;
                    case 4: it.tile.background = "blue";          break;
                    case 5: it.tile.background = "yellow";        break;
                    case 6: it.tile.background = "pink";          break;
                    case 7: it.tile.background = "darkBlue";      break;
                    case 8: it.tile.background = "purple";        break;
                    case 9: it.tile.background = "deepBlue";      break;
                    case 10: it.tile.background = "lightPurple";  break;
                    case 11: it.tile.background = "yellow";       break;
                    case 12: it.tile.background = "darkgreen";     break;
                    case 13: it.tile.background = "cyan";          break;
                    case 14: it.tile.background = "teal";          break;
                    case 15: it.tile.background = "lime";          break;
                    case 16: it.tile.background = "amber";         break;
                    case 17: it.tile.background = "amberAccent";   break;
                    case 18: it.tile.background = "lightyellow";   break;
                    case 19: it.tile.background = "darkred";       break;
                    case 20: it.tile.background = "darkyellow";    break;
                    case 21: it.tile.background = "lightblue";     break;
                    case 22: it.tile.background = "lightgray";     break;
                    case 23: it.tile.background = "gray";          break;
                    case 24: it.tile.background = "darkgray";      break;
                    case 25: it.tile.background = "bluegray";      break;
                    case 26: it.tile.background = "lightgreen";    break;
                    case 27: it.tile.background = "darkpurple";    break;
                    case 28: it.tile.background = "lightred";      break;
                }
                results.push(it);
            }
            return results;
        }

        vm.show = function(alert) {
            console.log(alert);
            if (!Notify.needsPermission) {
                notifyService.notify("teste");
            } else if (Notify.isSupported()) {
                Notify.requestPermission(onPermissionGranted("teste"), onPermissionDenied);
            }
        };

        vm.alertItems.$watch(function (event) {

            if (event.event === 'child_changed'){
                var message = vm.alertItems[event.key].configurations.name + " atualizada para " + vm.alertItems[event.key].lastUpdate.value + vm.alertItems[event.key].lastUpdate.unit;
                toastService.showMessage(message);
                notifyService.notify(message);
                console.log(event);
                console.log(message);
            }
        });

    }

})(angular);
