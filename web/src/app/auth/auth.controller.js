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

            let user = authService.isLoggedIn();
            let name, email, photoUrl, uid;

            if (user != null) {
                name = user.displayName;
                email = user.email;
                photoUrl = user.photoURL;
                uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                                 // this value to authenticate with your backend server, if
                                 // you have one. Use User.getToken() instead.
            }else{
                authService.login(user)
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