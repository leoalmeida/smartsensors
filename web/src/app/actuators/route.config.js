(function(angular) {
  'use strict';

    angular
      .module('app.actuators')
        .config(config);

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/actuators', {
                templateUrl: 'app/actuators/actuators-list.html',
                controller: 'ActuatorListController',
                controllerAs: 'vm',
                resolve: {
                    "currentUser": ["AuthService", function(authService) {
                        return authService.firebaseAuthObject.$requireSignIn();
                    }]
                }
            })
            .when('/actuators/:accessType/:location/:type', {
                templateUrl: 'app/actuators/actuators-detail.html',
                controller: 'ActuatorDetailsController',
                controllerAs: 'vm',
                resolve: {
                    "currentUser": ["AuthService", function(authService) {
                        return authService.firebaseAuthObject.$requireSignIn();
                    }]
                }
            })
            .when('/actuators/:accessType/:location/:type/:id', {
                templateUrl: 'app/actuators/actuators-detail.html',
                controller: 'ActuatorDetailsController',
                controllerAs: 'vm',
                resolve: {
                    "currentUser": ["AuthService", function(authService) {
                        return authService.firebaseAuthObject.$requireSignIn();
                    }]
                }
            });
    };

})(angular);
