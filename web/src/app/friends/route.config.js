(function(angular) {
  'use strict';

  angular
      .module('app.friends')
      .config(configFunction);
      //.run(runFunction);

    configFunction.$inject = ['$routeProvider'];

    function configFunction($routeProvider) {
        $routeProvider.when('/friends', {
            templateUrl: 'app/friends/friends-list.html',
            controller: 'FriendsListController',
            controllerAs: 'vm'
        })
        .when('/friends/:id', {
            templateUrl: 'app/friends/friends-editor.html',
            controller: 'FriendsEditorController',
            controllerAs: 'vm'
        })
        .when('/friends/new', {
            templateUrl: 'app/friends/friends-editor.html',
            controller: 'FriendsEditorController',
            controllerAs: 'vm'
        })
        .when('/friends/:id/edit', {
            templateUrl: 'app/friends/friends-editor.html',
            controller: 'FriendsEditorController',
            controllerAs: 'vm'
        });
    }
    /*
    runFunction.$inject = ['$location', 'CONSTANTS'];

    function runFunction($location, CONSTANTS) {

        authService.firebaseAuthObject.$onAuthStateChanged(function(authData) {
            if (!authData && pathIsProtected($location.path())) {
                authService.logout();
                $location.path('/login');
            }
        });

        function pathIsProtected(path) {
            return CONSTANTS.PROTECTED_PATHS.indexOf(path) !== -1;
        }
    }*/

})(angular);
