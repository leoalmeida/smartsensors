(function(angular) {
    'use strict';

    angular
      .module('app.sensors')
      .factory('SensorsInfoService', SensorsInfoService)
      .factory('SensorsSocket', SensorsSocket);


    SensorsSocket.$inject = ['socketFactory'];
    function SensorsSocket (socketFactory) {
            return socketFactory();
    };

    // UserService.$inject = ['$http', 'API'];
    // function UserService($http, API) {
    SensorsInfoService.$inject = ['firebaseDataService'];

    function SensorsInfoService(firebaseDataService) {
        var service = {
            getAll: getAll,
            getOne: getOne,
            addOne: addOne,
            updateOne: updateOne,
            removeOne: removeOne
        };

        return service;

        function getAll() {
            return firebaseDataService.getFullArray(firebaseDataService.sensors);
        }

        function getOne(key) {
          return firebaseDataService.getFilteredArray(firebaseDataService.sensors, key);
        }

        function addOne(newObject) {
            firebaseDataService.sensors.push({
                reading: newObject
            });
        }

        function updateOne(newObject) {
            return firebaseDataService.sensors.update({
                readings: newObject
            });
        }

        function removeOne(key) {
            firebaseDataService.sensors.remove({
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
