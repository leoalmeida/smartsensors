(function(angular) {
    'use strict';

    angular.module('app.notifications', [])
        .run(runFunction);

    runFunction.$inject = ['$rootScope', 'ToastService', '$location', '$log'];

    function runFunction($rootScope, toastService, $location, $log) {
        $rootScope.$log = $log;

        /*$rootScope.$on('$routeChangeError', function(event, next, previous, error) {
         toastService.serverError( error.message );
         if (error === "AUTH_REQUIRED") {
         $location.path('/login');
         }
         });*/

        $rootScope.$on( 'httpError', function( event, eventData ) {
            toastService.serverError( eventData.message );
        })
    }

})(angular);