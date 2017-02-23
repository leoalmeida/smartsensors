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
    ServersService.$inject = ['firebaseDataService', '$http', 'API'];

    function ServersService(firebaseDataService, $http, API) {

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
            getStatus: getStatus,
            startBoard: startBoard
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
            //return firebaseDataService.getFirebaseObject(database + '/' + type + '/' + currentUser.uid + '/' + location + '/' + key);
            return firebaseDataService.getRefFirebaseObject(database, key);
        }

        function getStatus(type, key) {
            return firebaseDataService.getFirebaseObject(database + '/' + type + '/' + key);
        }

        function addOne(newObject) {
            return firebaseDataService.getFirebaseArray(database + '/public').$add(newObject);
        }

        function removeOne(currentUser, type, key) {
            return firebaseDataService.getFirebaseObject(database + '/' + type + '/' + currentUser.uid).remove(key);
        }

        function getAllConfigurations() {
            return configRef;
        }

        function startBoard(data, cbSuccess, cbError) {
            return $http.post(API.servers.withkey + data.server + '/startboard', data).then(cbSuccess, cbError);
        }

    }

})(angular);
