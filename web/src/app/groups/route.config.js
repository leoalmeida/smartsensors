(function(angular) {
  'use strict';

  angular
      .module('app.groups')
      .config(config);

  config.$inject = ['$routeProvider'];

  function config($routeProvider) {
        $routeProvider
            .when('/groups', {
                templateUrl: 'app/groups/subscription-list.html',
                controller: 'SubscriptionsController',
                controllerAs: 'vm',
                resolve: {
                    "currentUser": ["AuthService", function(authService) {
                        return authService.firebaseAuthObject.$requireSignIn();
                    }]
                }
            })
            .when('/groups/list', {
                templateUrl: 'app/groups/group-list.html',
                controller: 'GroupsController',
                controllerAs: 'vm',
                resolve: {
                    "currentUser": ["AuthService", function(authService) {
                        return authService.firebaseAuthObject.$requireSignIn();
                    }]
                }
            })
            .when('/groups/creator', {
                templateUrl: 'app/groups/group-editor.html',
                controller: 'GroupsCreatorController',
                controllerAs: 'vm',
                resolve: {
                    "currentUser": ["AuthService", function(authService) {
                        return authService.firebaseAuthObject.$requireSignIn();
                    }]
                }
            });
  };

})(angular);
