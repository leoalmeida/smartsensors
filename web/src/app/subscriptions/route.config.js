(function(angular) {
  'use strict';

  angular
      .module('app.subscriptions')
      .config(config);

  config.$inject = ['$routeProvider'];

  function config($routeProvider) {
        $routeProvider
            .when('/subscriptions', {
                templateUrl: 'app/subscriptions/subscriptions-list.html',
                controller: 'SubscriptionsController',
                controllerAs: 'vm',
                resolve: {
                    "currentUser": ["AuthService", function(authService) {
                        return authService.firebaseAuthObject.$requireSignIn();
                    }]
                }
            })
            .when('/subscriptions/:accessType/:type', {
                templateUrl: 'app/subscriptions/subscriptions-editor.html',
                controller: 'SubscriptionController',
                controllerAs: 'vm',
                resolve: {
                    "currentUser": ["AuthService", function(authService) {
                        return authService.firebaseAuthObject.$requireSignIn();
                    }]
                }
            }).when('/subscriptions/:accessType/:type/:id', {
                templateUrl: 'app/subscriptions/subscriptions-editor.html',
                controller: 'SubscriptionController',
                controllerAs: 'vm',
                resolve: {
                    "currentUser": ["AuthService", function(authService) {
                        return authService.firebaseAuthObject.$requireSignIn();
                    }]
                }
            });
  };

})(angular);
