(function(angular) {
  'use strict';

  angular
      .module('app.auth')
      .config(configFunction)
      .run(runFunction);

    configFunction.$inject = ['$routeProvider'];

    function configFunction($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'app/auth/login.html',
            controller: 'AuthController',
            controllerAs: 'vm'
        });
    }

    runFunction.$inject = ['$location', 'AuthService', 'CONSTANTS'];

    function runFunction($location, authService, CONSTANTS) {

        authService.firebaseAuthObject.onAuthStateChanged(function(authData) {
            if (!authData && pathIsProtected($location.path())) {
                authService.logout();
                $location.path('/login');
            }
        });

        function pathIsProtected(path) {
            return CONSTANTS.PROTECTED_PATHS.indexOf(path) !== -1;
        }
    }

})(angular);
