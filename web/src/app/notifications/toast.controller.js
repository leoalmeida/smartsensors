(function(angular) {
    'use strict';

    angular
        .module('app.notifications')
        .controller('ToastController', ToastController);

    ToastController.$inject = ['$rootScope', '$location', '$mdToast', 'CONSTANTS'];

    function ToastController($rootScope, $location, $mdToast, CONSTANTS) {
        var vmToast = this;

        vmToast.message = $rootScope.param;

        vmToast.closeToast = function() {
            if (isDlgOpen) return vm.localSelectedMood;
            $mdToast
                .hide()
                .then(function() {
                    isDlgOpen = false;
                });
            return vm.localSelectedMood;
        };
        vmToast.openMoreInfo = function(value) {
            $mdToast
                .hide()
                .then(function() {
                    $location.path( value );
                });
        };
    }

})(angular);
