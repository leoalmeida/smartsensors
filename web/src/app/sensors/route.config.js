(function(angular) {
  'use strict';

    angular
      .module('app.sensors')
        .config(config);

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/sensors', {
                templateUrl: 'app/sensors/sensors-list.html',
                controller: 'SensorListController',
                controllerAs: 'vm',
                resolve: {
                    "currentUser": ["AuthService", function(authService) {
                        return authService.firebaseAuthObject.$requireSignIn();
                    }]
                }
            })
            .when('/sensors/:accessType/:location/:type', {
                templateUrl: 'app/sensors/sensors-detail.html',
                controller: 'SensorDetailsController',
                controllerAs: 'vm',
                resolve: {
                    "currentUser": ["AuthService", function(authService) {
                        return authService.firebaseAuthObject.$requireSignIn();
                    }]
                }
            })
            .when('/sensors/:accessType/:location/:type/:id', {
                templateUrl: 'app/sensors/sensors-detail.html',
                controller: 'SensorDetailsController',
                controllerAs: 'vm',
                resolve: {
                    "currentUser": ["AuthService", function(authService) {
                        return authService.firebaseAuthObject.$requireSignIn();
                    }]
                }
            })
            .when('/sensors/admin', {
                templateUrl: 'app/sensors/sensors-admin.html',
                controller: 'SensorAdminController',
                controllerAs: 'vm',
                resolve: {
                    "currentUser": ["AuthService", function(authService) {
                        return authService.firebaseAuthObject.$requireSignIn();
                    }]
                }
            });
    };

})(angular);
