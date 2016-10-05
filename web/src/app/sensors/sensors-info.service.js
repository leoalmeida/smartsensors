(function(angular) {
    'use strict';

    angular
      .module('app.sensors')
      .factory('SensorsInfoService', SensorsInfoService);
      // .factory('SensorsSocket', SensorsSocket);


    SensorsSocket.$inject = ['socketFactory'];
    function SensorsSocket (socketFactory) {
            return socketFactory();
    };

    // UserService.$inject = ['$http', 'API'];
    // function UserService($http, API) {
    SensorsInfoService.$inject = ['firebaseDataService'];

    function SensorsInfoService(firebaseDataService) {

        var sensorsRef = firebaseDataService.sensors;
        var database = sensorsRef.$id;
        var sensorsList = firebaseDataService.getFirebaseArray(sensorsRef.$id);
        var configRef = firebaseDataService.configurations;

        var service = {
            getAll: getAll,
            getOne: getOne,
            addOne: addOne,
            removeOne: removeOne,
            getAllConfigurations: getAllConfigurations
        };

        return service;

        function getAll() {
            return sensorsList;
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

        function getAllConfigurations() {
            return configRef;
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
