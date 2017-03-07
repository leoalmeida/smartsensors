(function(angular) {
  'use strict';

  angular
      .module('app.home')
      .config(configFunction)
      .run(["$rootScope", "$location", function($rootScope, $location) {
          $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
              if (error === "AUTH_REQUIRED") {
                  $location.path("/");
              }
          });
      }]);

    configFunction.$inject = ['$routeProvider','$locationProvider'];

    function configFunction($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                resolve: {
                    "currentUser": ["AuthService", function(authService) {
                        return authService.firebaseAuthObject.$waitForSignIn();
                    }]
                },
            }).when('/home', {
                templateUrl: 'app/home/twits.html',
                controller: 'TwitsController',
                controllerAs: 'vm',
                resolve: {
                    "currentUser": ["AuthService", function(authService) {
                        return authService.firebaseAuthObject.$requireSignIn()
                    }]
                }
            }).when('/profile', {
                templateUrl: 'app/home/home.profile.html',
                controller: 'HomeController',
                controllerAs: 'vm'
            }).when('/404', {
                templateUrl: 'app/home/404.layouts.html'
        });

        // configure html5 to get links working on jsfiddle
        $locationProvider.html5Mode(true);
    }


})(angular);
