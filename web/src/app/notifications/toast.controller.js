(function(angular) {
    'use strict';

    angular
        .module('app.notifications')
        .controller('ToastController', ToastController);

    ToastController.$inject = ['$rootScope', '$mdToast', 'CONSTANTS'];

    function ToastController($rootScope, $mdToast, CONSTANTS) {
        let vmToast = this;

        vmToast.values = CONSTANTS.MOODLIST;

        vmToast.closeToast = function() {
            if (isDlgOpen) return vm.localSelectedMood;
            $mdToast
                .hide()
                .then(function() {
                    isDlgOpen = false;
                });
            return vm.localSelectedMood;
        };
        vmToast.openMoreInfo = function(e) {
            if ( isDlgOpen ) return;
            isDlgOpen = true;
        };

        vmToast.setValue = function(value) {
            $mdToast
                .hide()
                .then(function() {
                    $rootScope.$broadcast('moodChanged', value);
                });
        };
    }

})(angular);
