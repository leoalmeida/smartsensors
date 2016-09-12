(function(angular) {
    'use strict';

    angular
      .module('app.friends')
      .factory('FriendsService', FriendsService);

    // UserService.$inject = ['$http', 'API'];
    // function UserService($http, API) {
    FriendsService.$inject = ['firebaseDataService'];

    function FriendsService(firebaseDataService) {
        var service = {
            getAll: getAll,
            getFiltered: getFiltered,
            addOne: addOne,
            updateOne: updateOne,
            removeOne: removeOne
        };

        return service;


        function getAll() {
            return firebaseDataService.getFullArray(firebaseDataService.friends);
        }

        function getFiltered(key) {
            return firebaseDataService.getFilteredArray(firebaseDataService.friends, key);
        }

        function addOne(newObject) {
            firebaseDataService.data(firebaseDataService.friends).push({
                alert: newObject
            });
        }

        function updateOne(newObject) {
            return firebaseDataService.data(firebaseDataService.friends).update({
                friends: newObject
            });
        }

        function removeOne(key) {
            firebaseDataService.data(firebaseDataService.friends).remove({
                _id: key
            });
        }

        /* service.save = function(friend) {
            if (friend._id){
                return $http.post(API.friends + friend._id, friend);
            } else {
                return $http.post(API.friends, friend);
            }

        };

        service.getById = function(id) {
            return $http.get(API.friends + id);
        };

        service.getAll = function(query) {
            return $http.get(API.friends, {
                params: query
            });
        };

        service.remove = function(id) {
            return $http.delete(API.friends + id);
        };


        return service;
        */
    }

})(angular);
