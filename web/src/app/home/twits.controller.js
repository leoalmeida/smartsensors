(function(angular) {
    'use strict';

    angular
        .module('app.home')
        .controller('TwitsController', TwitsController);


    TwitsController.$inject = ['$rootScope', 'CONSTANTS','currentUser', 'AlertService', '$mdDialog', 'ToastService', 'NotifyService', 'SubscriptionsService', '$filter'];

    function TwitsController($rootScope, CONSTANTS, currentUser, alertService, $mdDialog, toastService, notifyService, subscriptionsService, $filter) {

        var vm = this;

        vm.SCREENCONFIG = CONSTANTS.SCREENCONFIG.HOME;

        vm.subscribedItems = subscriptionsService.getOwn(currentUser);

        vm.trendingTopics = alertService.getPublic();

        vm.trendingTopics.$watch(function (event) {
            if (event.event === 'child_changed'){
              var alert = vm.alertItems.$getRecord(event.key);
              var message = alert.configurations.name + " atualizada para " + alert.lastUpdate.value + (alert.lastUpdate.unit || "");
              toastService.showMessage(message);
              notifyService.notify(message, "");
              console.log(event);
              console.log(message);
            }
        });

    }

})(angular);
