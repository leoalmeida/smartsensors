(function(angular) {
    'use strict';

    angular
      .module('app.actuators')
      .factory('ActuatorsService', ActuatorsService);
      // .factory('ActuatorsSocket', ActuatorsSocket);


    ActuatorsSocket.$inject = ['socketFactory'];
    function ActuatorsSocket (socketFactory) {
            return socketFactory();
    };

    // UserService.$inject = ['$http', 'API'];
    // function UserService($http, API) {
    ActuatorsService.$inject = ['firebaseDataService'];

    function ActuatorsService(firebaseDataService) {

        var database = firebaseDataService.actuators;
        var actuatorsList = firebaseDataService.getRefFirebaseArray(database);
        var configRef = firebaseDataService.configurations;

        var service = {
            getAll: getAll,
            getPublic: getPublic,
            getOwn: getOwn,
            getOne: getOne,
            addOne: addOne,
            removeOne: removeOne,
            getAllConfigurations: getAllConfigurations,
            getStatus: getStatus
        };

        return service;

        function getAll() {
            return actuatorsList;
        }

        function getPublic() {
            return firebaseDataService.getFirebaseArray(database + '/public' );
        }

        function getOwn(currentUser) {
            return firebaseDataService.getRefFirebaseArray(database, 'owner', currentUser.uid);
        }

        function getOne(key) {
            return firebaseDataService.getRefFirebaseObject(database, key);
        }

        function getStatus(type, currentUser, location) {
            return firebaseDataService.getFirebaseObject(database + '/' + type + '/' + currentUser.uid + '/' + location + '/connected');
        }

        function addOne(currentUser, type, location, newObject) {
//            firebaseDataService.getFirebaseArray('servers/' + currentUser.uid + '/' + location + '/sensors/').$save();
            return firebaseDataService.getFirebaseArray(database + '/' + type ).$add(newObject);
        }

        function removeOne(currentUser, type, location, key) {
            return firebaseDataService.getFirebaseObject(database + '/' + type ).remove(key);
        }


        function getAllConfigurations() {
            return configRef;
        }

    }

})(angular);
