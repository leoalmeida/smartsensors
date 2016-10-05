(function(angular) {
  'use strict';

  angular
      .module('app.alerts')
      .config(config);

  config.$inject = ['$routeProvider'];

  function config($routeProvider) {
        $routeProvider
            .when('/alerts', {
                templateUrl: 'app/alerts/alert-list.html',
                controller: 'AlertController',
                controllerAs: 'vm'
            })
            .when('/alerts/creator', {
                templateUrl: 'app/alerts/alert-editor.html',
                controller: 'AlertCreatorController',
                controllerAs: 'vm'
            })
            .when('/map', {
                templateUrl: 'app/alerts/map-details.html',
                controller: 'MapController',
                controllerAs: 'vm'
            });
  };

})(angular);
