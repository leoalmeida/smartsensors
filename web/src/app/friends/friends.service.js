(function(angular) {
    'use strict';

    angular
      .module('app.friends')
      .factory('FriendsService', FriendsService);

    // UserService.$inject = ['$http', 'API'];
    // function UserService($http, API) {
    FriendsService.$inject = ['firebaseDataService'];

    function FriendsService(firebaseDataService) {

        var friendsRef = firebaseDataService.friends;
        var database = friendsRef.$id;
        var friendsList = firebaseDataService.getFirebaseArray(friendsRef.$id + '/0');
        var configRef = firebaseDataService.configurations;

        var service = {
            getAll: getAll,
            getOne: getOne,
            getOwn: getOwn,
            addOne: addOne,
            removeOne: removeOne
        };

        return service;

        function getAll() {
            return friendsList;
        }

        function getOwn(currentUser) {
            return firebaseDataService.getFirebaseArray(database + '/public/' + currentUser.uid);
        }

        function getOne(key) {
            return firebaseDataService.getFirebaseObject(database + '/' + key);
        }

        function addOne(newObject) {
            return firebaseDataService.getFirebaseObject(database).$add(newObject);
        }

        function removeOne(key) {
            return firebaseDataService.getFirebaseObject(database).remove(key);
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
