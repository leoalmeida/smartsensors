(function(angular) {
    'use strict';

    var isDlgOpen;

    angular
        .module('app.core')
        .directive('asNavbar', asNavbar);

    function asNavbar() {
        return {
            templateUrl: 'app/core/layouts/navbar.layout.html',
            restrict: 'E',
            scope: {},
            controller: NavbarController,
            controllerAs: 'vm'
        };
    }

    NavbarController.$inject = ['$rootScope', 'CONSTANTS', 'AuthService', '$location', '$timeout', '$mdSidenav', '$log', 'ToastService', '$mdDialog'];

    function NavbarController($rootScope, CONSTANTS, authService, $location, $timeout, $mdSidenav, $log, toastService, $mdDialog) {
        var vm = this;

        vm.menuItems = CONSTANTS.MENU;
        vm.status = false;

        vm.close = close;
        vm.logout = logout;
        vm.login = login;
        vm.goToUserProfile = goToUserProfile;
        vm.openModal = openModal;
        vm.navigateTo = navigateTo;

        vm.toggleLeft = buildDelayedToggler('menu');

        vm.toggleLeft = function toggleLeft(){
            return $mdSidenav('menu').toggle();
        };

        function close(){
            return $mdSidenav('menu').close();
        };

        function logout() {
            authService.toggleGoogleSignIn();
            $location.path('/login');
        }

        function login() {
            authService.toggleGoogleSignIn();
            $location.path('/friends');
            toastService.showTemplate();
        };

        authService.firebaseAuthObject
            .$onAuthStateChanged(function(user) {
            if (user) {
                vm.user = user;
                vm.status = true;
            }
        });

        /**
         * Supplies a function that will continue to operate until the
         * time is up.
         */
        function debounce(func, wait, context) {
            var timer;
            return function debounced() {
                var context = vm,
                    args = Array.prototype.slice.call(arguments);
                $timeout.cancel(timer);
                timer = $timeout(function() {
                    timer = undefined;
                    func.apply(context, args);
                }, wait || 10);
            };
        }

        /**
         * Build handler to open/close a SideNav; when animation finishes
         * report completion in console
         */
        function buildDelayedToggler(navID) {
            return debounce(function() {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        $log.debug("toggle " + navID + " is done");
                    });
            }, 200);
        }

        function buildToggler(navID) {
            return function() {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav(navID)
                    .toggle()
                    .then(function () {
                        $log.debug("toggle " + navID + " is done");
                    });
            }
        }

        function goToUserProfile(person, event) {
            $mdDialog.show(
                $mdDialog.alert()
                    .title('Navigating')
                    .textContent('Inspect ' + person)
                    .ariaLabel('To be defined.')
                    .ok('ok')
                    .targetEvent(event)
            );
        };

        function openModal(to, event) {
            $mdDialog.show(
                $mdDialog.alert()
                    .title('Navigating')
                    .textContent('navgate ' + to)
                    .ariaLabel('To be defined.')
                    .ok('ok!')
                    .targetEvent(event)
            );
        };

        function navigateTo( path ) {
            $location.path( path );
            vm.close();
        };
    }

})(angular);
