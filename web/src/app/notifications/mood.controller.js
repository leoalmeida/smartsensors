(function(angular) {
    'use strict';

    angular
        .module('app.notifications')
        .controller('MoodController', MoodController);

    MoodController.$inject = ['$rootScope', '$mdToast', 'CONSTANTS'];

    function MoodController($rootScope, $mdToast, CONSTANTS) {
        var vmToast = this;

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
