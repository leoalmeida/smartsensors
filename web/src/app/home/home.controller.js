(function(angular) {
    'use strict';

    angular
        .module('app.home')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope'];

    function HomeController($scope) {
        var vm = this;

        vm.users = [];

        vm.initList = function() {

        };

        vm.show = function(user) {
            console.log(user);
        };

    }

})(angular);
