(function(angular) {
    'use strict';

    angular
        .module('app.notifications')
        .factory('ToastInterceptor', ToastInterceptor);

    ToastInterceptor.$inject = ['$rootScope', '$q'];

    function ToastInterceptor($rootScope, $q ) {
        var service = {
            responseError: responseError
        };

        return service;

        function responseError( response ) {

            switch ( response.status ) {
                //...can handle different error codes differently
                case 500:
                    $rootScope.$broadcast( 'httpError', { message: 'An unexpected error has occurred. Please try again.' } );
                    break;
            }

            return $q.reject( response );
        }
    }

})(angular);
