(function(angular) {
  'use strict';

    angular
      .module('app.servers')
        .config(config);

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/servers', {
                templateUrl: 'app/servers/servers-list.html',
                controller: 'ServerListController',
                controllerAs: 'vm',
                resolve: {
                    "currentUser": ["AuthService", function(authService) {
                        return authService.firebaseAuthObject.$requireSignIn();
                    }]
                }
            })
            .when('/servers/:accessType/:location/:type', {
                templateUrl: 'app/servers/servers-detail.html',
                controller: 'ServerDetailsController',
                controllerAs: 'vm',
                resolve: {
                    "currentUser": ["AuthService", function(authService) {
                        return authService.firebaseAuthObject.$requireSignIn();
                    }]
                }
            })
            .when('/servers/:accessType/:location/:type/:id', {
                templateUrl: 'app/servers/servers-detail.html',
                controller: 'ServerDetailsController',
                controllerAs: 'vm',
                resolve: {
                    "currentUser": ["AuthService", function(authService) {
                        return authService.firebaseAuthObject.$requireSignIn();
                    }]
                }
            })
            .when('/servers/admin', {
                templateUrl: 'app/servers/servers-admin.html',
                controller: 'ServerAdminController',
                controllerAs: 'vm',
                resolve: {
                    "currentUser": ["AuthService", function(authService) {
                        return authService.firebaseAuthObject.$requireSignIn();
                    }]
                }
            });
    };

})(angular);
