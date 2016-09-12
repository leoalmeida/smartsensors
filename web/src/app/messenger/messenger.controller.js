(function(angular) {
    'use strict';

    angular
        .module('app.messenger')
        .controller('MessengerController', MessengerController);

    MessengerController.$inject = ['$rootScope', '$mdToast'];

    function MessengerController($rootScope, $mdToast) {
        var vm = this;

        $rootScope.$on('show-message', function(event, message){
            $mdToast.showSimple(message);
        });

        vm.showMessage = function(message){
            $rootScope.$broadcast('show-message', message);
        }
    }
})(angular);