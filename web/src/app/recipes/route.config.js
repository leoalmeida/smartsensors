(function(angular) {
  'use strict';

  angular
      .module('app.recipes')
      .config(config);

  config.$inject = ['$routeProvider'];

  function config($routeProvider) {
        $routeProvider
            .when('/recipes', {
                templateUrl: 'app/recipes/recipes-list.html',
                controller: 'RecipesController',
                controllerAs: 'vm',
                resolve: {
                    "currentUser": ["AuthService", function(authService) {
                        return authService.firebaseAuthObject.$requireSignIn();
                    }]
                }
            })
            .when('/recipes/:accessType/:type', {
                templateUrl: 'app/recipes/recipes-grooming.html',
                controller: 'RecipeCreatorController',
                controllerAs: 'vm',
                resolve: {
                    "currentUser": ["AuthService", function(authService) {
                        return authService.firebaseAuthObject.$requireSignIn();
                    }]
                }
            }).when('/recipes/:accessType/:type/:id', {
                templateUrl: 'app/recipes/recipes-grooming.html',
                controller: 'RecipeCreatorController',
                controllerAs: 'vm',
                resolve: {
                    "currentUser": ["AuthService", function(authService) {
                        return authService.firebaseAuthObject.$requireSignIn();
                    }]
                }
            });
  };

})(angular);
