(function(angular) {
    'use strict';



    angular
        .module('app.home')
        .controller('HomeController', HomeController);


    HomeController.$inject = ['$rootScope', 'currentUser', 'AlertService', '$mdDialog', 'ToastService', 'NotifyService', 'SubscriptionsService', '$filter'];

    function HomeController($rootScope, currentUser, alertService, $mdDialog, toastService, notifyService, subscriptionsService, $filter) {

        var vm = this;

        vm.alertItems = alertService.getPublic();

        vm.subscribedItems = subscriptionsService.getOwn(currentUser);

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
