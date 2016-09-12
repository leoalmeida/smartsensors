(function() {
    'use strict';

    angular
      .module('app.home')
      .factory('UserService', UserService);

    // UserService.$inject = ['$http', 'API'];
    // function UserService($http, API) {

    UserService.$inject = ['firebaseDataService'];

    function UserService(firebaseDataService) {

        var service = {
            getAll: getAll,
            getOne: getOne,
            addOne: addOne,
            updateOne: updateOne,
            removeOne: removeOne
        };

        return service;


        function getAll() {
            return firebaseDataService.users;
        }

        function getOne(key) {
            return firebaseDataService.users.child(key);
        }

        function addOne(newObject) {
            firebaseDataService.users.push({
                alert: newObject
            });
        }

        function updateOne(newObject) {
            return firebaseDataService.users.update({
                users: newObject
            });
        }

        function removeOne(key) {
            firebaseDataService.users.remove({
                _id: key
            });
        }



        /*
        function saveUser(user) {
          return $http.post(API.user, user);
        };


        function getAllUsers() {
            return $http.get(API.user);
        };
        */

    }

})();
