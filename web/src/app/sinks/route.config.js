(function(angular) {
  'use strict';

    angular
      .module('app.sinks')
        .config(config);

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/sinks', {
                templateUrl: 'app/sinks/sinks-list.html',
                controller: 'SinkListController',
                controllerAs: 'vm',
                resolve: {
                    "currentUser": ["AuthService", function(authService) {
                        return authService.firebaseAuthObject.$requireSignIn();
                    }]
                }
            })
            .when('/sinks/:accessType/:location/:type', {
                templateUrl: 'app/sinks/sinks-detail.html',
                controller: 'SinkDetailsController',
                controllerAs: 'vm',
                resolve: {
                    "currentUser": ["AuthService", function(authService) {
                        return authService.firebaseAuthObject.$requireSignIn();
                    }]
                }
            })
            .when('/sinks/:accessType/:location/:type/:id', {
                templateUrl: 'app/sinks/sinks-detail.html',
                controller: 'SinkDetailsController',
                controllerAs: 'vm',
                resolve: {
                    "currentUser": ["AuthService", function(authService) {
                        return authService.firebaseAuthObject.$requireSignIn();
                    }]
                }
            })
            .when('/sinks/admin', {
                templateUrl: 'app/sinks/sinks-admin.html',
                controller: 'SinkAdminController',
                controllerAs: 'vm',
                resolve: {
                    "currentUser": ["AuthService", function(authService) {
                        return authService.firebaseAuthObject.$requireSignIn();
                    }]
                }
            });
    };

})(angular);
