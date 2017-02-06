(function(angular) {
  'use strict';

    angular
      .module('app.info')
        .config(config);

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/info', {
                templateUrl: 'app/info/info-list.html',
                controller: 'InfoListController',
                controllerAs: 'vm',
                resolve: {
                    "currentUser": ["AuthService", function(authService) {
                        return authService.firebaseAuthObject.$requireSignIn();
                    }]
                }
            })
            .when('/info/:accessType/:location/:type', {
                templateUrl: 'app/info/info-detail.html',
                controller: 'InfoDetailsController',
                controllerAs: 'vm',
                resolve: {
                    "currentUser": ["AuthService", function(authService) {
                        return authService.firebaseAuthObject.$requireSignIn();
                    }]
                }
            })
            .when('/info/:accessType/:location/:type/:id', {
                templateUrl: 'app/info/info-detail.html',
                controller: 'InfoDetailsController',
                controllerAs: 'vm',
                resolve: {
                    "currentUser": ["AuthService", function(authService) {
                        return authService.firebaseAuthObject.$requireSignIn();
                    }]
                }
            });
    };

})(angular);
