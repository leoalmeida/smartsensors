(function(angular) {
    'use strict';

    angular.module('app.notifications')
        .config(config);

    config.$inject = ['$httpProvider'];

    function config($httpProvider) {
        $httpProvider.interceptors.push('ToastInterceptor');
    }

})(angular);