(function(angular) {
    'use strict';



    angular
        .module('app.alerts')
        .controller('AlertController', AlertController);


    AlertController.$inject = ['$scope','AlertService', '$mdDialog', 'ToastService', 'webNotification'];

    function AlertController($scope, alertService, $mdDialog, toastService, webNotification) {

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
                doNotification("teste");
            } else if (Notify.isSupported()) {
                Notify.requestPermission(onPermissionGranted("teste"), onPermissionDenied);
            }
        };

        vm.save = function(alert) {
            alertService.save(alert)
                .then(function(resp) {
                    console.log(resp);
                })
                .catch(function(err) {
                    console.log(err);
                });
        };

        vm.addNewAction = function(event) {
            $mdDialog.show(
                $mdDialog.alert()
                    .title('Secondary Action')
                    .textContent('Secondary actions can be used for one click actions')
                    .ariaLabel('Secondary click demo')
                    .ok('Neat!')
                    .targetEvent(event)
            );
        };

        vm.alertItems.$watch(function (event) {

            if (event.event === 'child_changed'){
                let message = vm.alertItems[event.key].configurations.name + " atualizada para " + vm.alertItems[event.key].lastUpdate.value + vm.alertItems[event.key].lastUpdate.unit;
                toastService.showMessage(message);
                console.log(event);
                console.log(message);

                doNotification(message);

            }
        });

        function doNotification(message) {
            if(webNotification.allowRequest) {
                webNotification.showNotification('Smart Sensors', {
                    body: message,
                    icon: 'assets/icons/motion.jpg',
                    onClick: function onNotificationClicked() {
                        console.log('Notification clicked.');
                    },
                    autoClose: 4000 //auto close the notification after 4 seconds (you can manually close it via hide function)
                }, function onShow(error, hide) {
                    if (error) {
                        window.alert('Unable to show notification: ' + error.message);
                    } else {
                        console.log('Notification Shown.');

                        setTimeout(function hideNotification() {
                            console.log('Hiding notification....');
                            hide(); //manually close the notification (you can skip this if you use the autoClose option)
                        }, 5000);
                    }
                });
            }
        }

    }

})(angular);
