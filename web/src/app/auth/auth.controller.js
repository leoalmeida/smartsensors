(function(angular) {
    'use strict';

    angular
        .module('app.auth')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['$location', 'AuthService'];

    function AuthController($location, authService) {
        var vm = this;

        vm.error = null;

        vm.register = register;
        vm.login = login;


        (function initController() {
            // reset login status
            authService.clearCredentials();
        })();

        function register(user) {
            return authService.register(user)
                .then(function() {
                    return vm.login(user);
                })
                .then(function() {
                    return authService.sendWelcomeEmail(user.email);
                })
                .catch(function(error) {
                    vm.error = error;
                });
        }

        function login() {

            vm.dataLoading = true;

            if (authService.isLoggedIn() == null) {
                authService.googlelogin(user)
                    .then(function() {
                        $location.path('/home');
                    })
                    .catch(function(error) {
                        vm.error = error;
                    });
            }

            return
        }
    }

})(angular);