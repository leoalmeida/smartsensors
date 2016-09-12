(function(angular) {
    'use strict';

    angular
      .module('app.sensors')
      .factory('ReadingsService', ReadingsService);

    // UserService.$inject = ['$http', 'API'];
    // function UserService($http, API) {
    ReadingsService.$inject = ['firebaseDataService'];

    function ReadingsService(firebaseDataService) {
        var service = {
            getAll: getAll,
            getOne: getOne,
            addOne: addOne,
            updateOne: updateOne,
            removeOne: removeOne
        };

        return service;


        function getAll() {
            return firebaseDataService.readings;
        }

        function getOne(key) {
            return firebaseDataService.readings.child(key);
        }

        function addOne(newObject) {
            firebaseDataService.readings.push({
                reading: newObject
            });
        }

        function updateOne(newObject) {
            return firebaseDataService.readings.update({
                readings: newObject
            });
        }

        function removeOne(key) {
            firebaseDataService.readings.remove({
                _id: key
            });
        }

        /* service.save = function(contact) {
            if (contact._id){
                return $http.post(API.friends + contact._id, contact);
            } else {
                return $http.post(API.friends, contact);
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
