(function(angular) {
  'use strict';

  angular
      .module('app.home')
      .config(configFunction);

    configFunction.$inject = ['$routeProvider'];

    function configFunction($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: 'app/home/home.html',
                controller: 'HomeController',
                controllerAs: 'vm'
            }).when('/profile', {
                templateUrl: 'app/home/home.profile.html',
                controller: 'HomeController',
                controllerAs: 'vm'
            }).when('/404', {
                templateUrl: 'app/home/404.layouts.html'
        });
    };


})(angular);
