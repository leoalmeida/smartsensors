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
                controllerAs: 'vm'
            })
            .when('/sensors/:id', {
                templateUrl: 'app/sensors/sensors-details.html',
                controller: 'SensorDetailsController',
                controllerAs: 'vm'
            })
            .when('/sensors/admin', {
                templateUrl: 'app/sensors/sensors-admin.html',
                controller: 'SensorAdminController',
                controllerAs: 'vm'
            });
    };

})(angular);
