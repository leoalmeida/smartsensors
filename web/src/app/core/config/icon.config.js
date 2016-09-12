(function(angular) {
    'use strict';

    angular.module('app.core').config(config);

    config.$inject = ['$mdIconProvider'];

    function config($mdIconProvider) {
        $mdIconProvider
            .iconSet('maps', 'assets/icons/maps-icons.svg', 24)
            .iconSet('action', 'assets/icons/action-icons.svg', 24)
            .iconSet('editor', 'assets/icons/editor-icons.svg', 24)
            .iconSet('communication', 'assets/icons/communication-icons.svg', 24)
            .iconSet('alert', 'assets/icons/alert-icons.svg', 24);
    }

})(angular);