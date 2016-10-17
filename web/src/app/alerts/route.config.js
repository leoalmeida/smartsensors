(function(angular) {
  'use strict';

  angular
      .module('app.alerts')
      .config(config);

  config.$inject = ['$routeProvider'];

  function config($routeProvider) {
        $routeProvider
            .when('/map', {
                templateUrl: 'app/alerts/map-details.html',
                controller: 'MapController',
                controllerAs: 'vm',
                resolve: {
                    "currentUser": ["AuthService", function(authService) {
                        return authService.firebaseAuthObject.$requireSignIn();
                    }]
                }
            });
  };

})(angular);
