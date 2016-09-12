(function(angular) {
    'use strict';

    angular
        .module('app.core')
        .directive('asAuthForm', asAuthForm)
        .directive('asProfileCard', asProfileCard)
        .directive('asLoginCard', asLoginCard);

    function asProfileCard() {
        return {
            templateUrl: 'app/core/layouts/profile.card.html',
            restrict: 'E',
            scope: {},
            controller: AuthCardsController,
            controllerAs: 'vm'
        };
    }

    function asLoginCard() {
        return {
            templateUrl: 'app/core/layouts/login.card.html',
            restrict: 'E',
            scope: {},
            controller: AuthCardsController,
            controllerAs: 'vm'
        };
    }

    function asAuthForm() {
        return {
            templateUrl: 'app/core/layouts/authForm.html',
            restrict: 'E',
            controller: AuthCardsController,
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                error: '=',
                formTitle: '@',
                submitAction: '&'
            }
        };
    }

    AuthCardsController.$inject = ['$scope', '$location', 'AuthService', 'ToastService', 'CONSTANTS'];

    function AuthCardsController($scope, $location, authService, toastService, CONSTANTS) {
        var vm = this;

        // vm.user = authService.credentials.user;
        vm.login_local = false;
        vm.error = null;
        vm.notifications = true;
        vm.selectedMood = CONSTANTS.MOODLIST[0].link;

        authService.firebaseAuthObject
            .onAuthStateChanged(function(user) {
                if (user) {
                    // User is signed in.
                    vm.user = user;
                    vm.status = true;

                } else {
                    vm.user = null;
                    vm.status = false;
                }
            });


        vm.googlelogin = googlelogin;
        vm.onSignIn = onSignIn;
        vm.toggleNotifications = toggleNotifications;
        vm.changeMood = changeMood;

        function googlelogin() {
            authService.googlelogin()
                .then(function() {
                    $location.path('/friends');
                })
                .catch(function(error) {
                    vm.error = error;
                });
        }

        function onSignIn(googleUser) {
            var profile = googleUser.getBasicProfile();
            console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
            console.log('Name: ' + profile.getName());
            console.log('Image URL: ' + profile.getImageUrl());
            console.log('Email: ' + profile.getEmail());
        }

        function toggleNotifications(){
            vm.notifications = !vm.notifications;
        };

        function changeMood(){
            toastService.moodChange();
        };


        $scope.$on('moodChanged', function(event, data) {
            vm.selectedMood = CONSTANTS.MOODLIST[data].link;
        })

    }

})(angular);
