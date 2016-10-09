(function(angular) {
    'use strict';

    angular
      .module('app.sensors')
      .factory('SensorsService', SensorsService);
      // .factory('SensorsSocket', SensorsSocket);


    SensorsSocket.$inject = ['socketFactory'];
    function SensorsSocket (socketFactory) {
            return socketFactory();
    };

    // UserService.$inject = ['$http', 'API'];
    // function UserService($http, API) {
    SensorsService.$inject = ['firebaseDataService'];

    function SensorsService(firebaseDataService) {

        var sensorsRef = firebaseDataService.sensors;
        var database = sensorsRef.$id;
        var sensorsList = firebaseDataService.getFirebaseArray(sensorsRef.$id);
        var configRef = firebaseDataService.configurations;

        var service = {
            getAll: getAll,
            getPublic: getPublic,
            getOwn: getOwn,
            getOne: getOne,
            addOne: addOne,
            removeOne: removeOne,
            getAllConfigurations: getAllConfigurations
        };

        return service;

        function getAll() {
            return sensorsList;
        }

        function getPublic() {
            return firebaseDataService.getFirebaseArray(database + '/public' );
        }

        function getOwn(currentUser) {
            return firebaseDataService.getFirebaseArray(database + '/public/' + currentUser.uid);
        }

        function getOne(type, key) {
            return firebaseDataService.getFirebaseObject(database + '/' + type + '/' + key);
        }

        function addOne(type, newObject) {
            return firebaseDataService.getFirebaseObject(database + '/' + type).$add(newObject);
        }

        function removeOne(type, key) {
            return firebaseDataService.getFirebaseObject(database + '/' + type).remove(key);
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
