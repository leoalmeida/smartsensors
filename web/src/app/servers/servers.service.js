(function(angular) {
    'use strict';

    angular
      .module('app.servers')
      .factory('ServersService', ServersService);
      // .factory('ServersSocket', ServersSocket);


    ServersSocket.$inject = ['socketFactory'];
    function ServersSocket (socketFactory) {
            return socketFactory();
    };

    // UserService.$inject = ['$http', 'API'];
    // function UserService($http, API) {
    ServersService.$inject = ['firebaseDataService'];

    function ServersService(firebaseDataService) {

        var database = firebaseDataService.servers;
        var serversList = firebaseDataService.getRefFirebaseArray(database, 'owner');
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
            return serversList;
        }

        function getPublic() {
            return firebaseDataService.getFirebaseArray(database + '/public' );
        }

        function getOwn(currentUser) {
            //return firebaseDataService.getFirebaseArray(database + '/public/', currentUser.uid);
            return firebaseDataService.getRefFirebaseArray(database, 'owner', currentUser.uid);
        }

        function getOne(type, currentUser, location, key) {
            return firebaseDataService.getFirebaseObject(database + '/' + type + '/' + currentUser.uid + '/' + location + '/' + key);
        }

        function getStatus(type, currentUser, location) {
            return firebaseDataService.getFirebaseObject(database + '/' + type + '/' + currentUser.uid + '/' + location + '/connected');
        }

        function addOne(currentUser, type, location, newObject) {
            return firebaseDataService.getFirebaseArray(database + '/' + type + '/' + currentUser.uid + '/' + location ).$add(newObject);
        }

        function removeOne(currentUser, type, key) {
            return firebaseDataService.getFirebaseObject(database + '/' + type + '/' + currentUser.uid).remove(key);
        }

        function getAllConfigurations() {
            return configRef;
        }

    }

})(angular);
