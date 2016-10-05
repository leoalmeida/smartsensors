(function() {
    'use strict';

    angular
        .module('app.alerts')
        .factory('AlertService', AlertService);

    AlertService.$inject = ['firebaseDataService'];

    function AlertService(firebaseDataService) {

        var alertsRef = firebaseDataService.alerts;
        var database = alertsRef.$id;
        var alertsList = firebaseDataService.getFirebaseArray(alertsRef.$id);
        var configRef = firebaseDataService.configurations;


        var service = {
            getAll: getAll,
            getOne: getOne,
            addOne: addOne,
            removeOne: removeOne
        };

        return service;

        ////////////

        function getAll() {
            return alertsList;
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

    }

})();
