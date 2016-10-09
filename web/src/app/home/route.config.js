(function(angular) {
  'use strict';

  angular
      .module('app.home')
      .config(configFunction)
      .run(["$rootScope", "$location", function($rootScope, $location) {
          $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
              if (error === "AUTH_REQUIRED") {
                  $location.path("/home");
              }
          });
      }]);

    configFunction.$inject = ['$routeProvider'];

    function configFunction($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/home/home.html',
                controller: 'HomeController',
                controllerAs: 'vm',
                resolve: {
                    "currentUser": ["AuthService", function(authService) {
                        return authService.firebaseAuthObject.$waitForSignIn();
                    }]
                }
            }).when('/profile', {
                templateUrl: 'app/home/home.profile.html',
                controller: 'HomeController',
                controllerAs: 'vm'
            }).when('/404', {
                templateUrl: 'app/home/404.layouts.html'
        });
    }


})(angular);
