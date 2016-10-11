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
            getAllConfigurations: getAllConfigurations,
            getOwnServers: getOwnServers
        };

        return service;

        function getAll() {
            return sensorsList;
        }

        function getPublic() {
            return firebaseDataService.getFirebaseArray(database + '/public' );
        }

        function getOwn(currentUser) {
            return firebaseDataService.getFirebaseArray(database + '/public/', currentUser.uid);
        }

        function getOne(type, currentUser, location, key) {
            return firebaseDataService.getFirebaseObject(database + '/' + type + '/' + currentUser.uid + '/' + location + '/' + key);
        }

        function addOne(currentUser, type, location, newObject) {
            firebaseDataService.getFirebaseArray('servers/' + currentUser.uid + '/' + location).$save();
            return firebaseDataService.getFirebaseArray(database + '/' + type + '/' + currentUser.uid + '/' + location).$add(newObject);
        }

        function removeOne(type, key) {
            return firebaseDataService.getFirebaseObject(database + '/' + type).remove(key);
        }

        function getAllConfigurations() {
            return configRef;
        }

        function getOwnServers(currentUser) {
            return firebaseDataService.getFirebaseArray('servers/', currentUser.uid);
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
