(function(angular) {
  'use strict';

    angular
      .module('app.messenger')
      .config(config);

    config.$inject = ['$routeProvider'];

    function config($routeProvider) {
        $routeProvider
            .when('/messenger', {
                templateUrl: 'app/messenger/messenger.list.html',
                controller: 'MessengerController',
                controllerAs: 'vm'
            });
    };

})(angular);
