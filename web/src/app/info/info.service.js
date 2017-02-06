(function(angular) {
    'use strict';

    angular
      .module('app.info')
      .factory('InfoService', InfoService);
      // .factory('InfoSocket', InfoSocket);


    InfoSocket.$inject = ['socketFactory'];
    function InfoSocket (socketFactory) {
            return socketFactory();
    };

    // UserService.$inject = ['$http', 'API'];
    // function UserService($http, API) {
    InfoService.$inject = ['firebaseDataService'];

    function InfoService(firebaseDataService) {

        var database = firebaseDataService.info;
        var infoList = firebaseDataService.getRefFirebaseObject(database, "");
        var configRef = firebaseDataService.configurations;

        var service = {
            getAll: getAll,
            getPublic: getPublic,
            getOwn: getOwn,
            getOne: getOne,
            removeOne: removeOne,
            getAllConfigurations: getAllConfigurations
        };

        return service;

        function getAll() {
            return infoList;
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

        function removeOne(currentUser, type, key) {
            return firebaseDataService.getFirebaseObject(database + '/' + type ).remove(key);
        }

        function getAllConfigurations() {
            return configRef;
        }

    }

})(angular);
