(function(angular) {
    'use strict';

    angular
        .module('app.messenger')
        .factory('MessengerService', MessengerService);

    MessengerService.$inject = ['$rootScope'];

    function MessengerService($rootScope) {

        var service = {};

        service.show = function(message) {
            $rootScope.$broadcast('show-message', message);
        };

        return service;
    }
})(angular);