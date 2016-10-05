(function(angular) {
  'use strict';

  angular
      .module('app.groups')
      .config(config);

  config.$inject = ['$routeProvider'];

  function config($routeProvider) {
        $routeProvider
            .when('/groups', {
                templateUrl: 'app/groups/group-list.html',
                controller: 'GroupsController',
                controllerAs: 'vm'
            })
            .when('/groups/creator', {
                templateUrl: 'app/groups/group-editor.html',
                controller: 'GroupsCreatorController',
                controllerAs: 'vm'
            });
  };

})(angular);
