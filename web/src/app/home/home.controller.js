(function(angular) {
    'use strict';



    angular
        .module('app.home')
        .controller('HomeController', HomeController);


    HomeController.$inject = ['$rootScope', 'currentUser', 'AlertService', '$mdDialog', 'ToastService', 'NotifyService', 'SubscriptionsService', '$filter'];

    function HomeController($rootScope, currentUser, alertService, $mdDialog, toastService, notifyService, subscriptionsService, $filter) {

        var vm = this;

        vm.subscribedItems = subscriptionsService.getOwn(currentUser);

        vm.alertItems = [];

        vm.alertList = alertService.getPublic();
        vm.alertList.$loaded(function (snapshot) {
            var i, j, l = snapshot.length;
            for (i = 0; i < l; i += 1) {
                angular.forEach(snapshot[i], function(value, key) {
                    if (angular.isObject(value)){
                        vm.alertItems.push(vm.alertList.ref().child(key));
                    }
                });
            }
        });

        alerts.$watch(function (event) {
            if (event.event === 'child_changed'){
                // changeItems(event);
                var message = "";
                //var message = vm.alertItems[event.key].configurations.name + " atualizada para " + vm.alertItems[event.key].lastUpdate.value + vm.alertItems[event.key].lastUpdate.unit;
                toastService.showMessage(message);
                notifyService.notify(message);
                console.log(event);
                console.log(message);
            }
        });

        function changeItems(event){

        }

    }

})(angular);
