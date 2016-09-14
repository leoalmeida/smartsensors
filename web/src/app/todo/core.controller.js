(function(angular) {
    'use strict';

    var isDlgOpen;

    angular
        .module('app.core')
        .controller('MainController', MainController)
        .controller('IndexController', IndexController);

    MainController.$inject = [];

    function MainController() {
        var vm = this;

        vm.people = [];
        vm.person = {};
        vm.add = function() {
            vm.people.push(vm.person);
            vm.person = {};
        };
    }

    IndexController.$inject = [];

    function IndexController() {
        var vm = this;

        vm.people = [];
        vm.person = {};
        vm.add = function() {
            vm.people.push(vm.person);
            vm.person = {};
        };
    }

})(angular);
