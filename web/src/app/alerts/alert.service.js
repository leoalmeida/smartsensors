(function(angular) {
    'use strict';

    angular
        .module('app.alerts')
        .factory('AlertService', AlertService);

    AlertService.$inject = ['firebaseDataService', '$firebaseArray'];

    function AlertService(firebaseDataService, $firebaseArray) {

        var alertsRef = firebaseDataService.alerts;
        var database = alertsRef.$id;
        var alertsList = firebaseDataService.getFirebaseArray(alertsRef.$id);
        var configRef = firebaseDataService.configurations;


        var service = {
            getAll: getAll,
            getPublic: getPublic,
            getOwn: getOwn,
            getOne: getOne,
            addOne: addOne,
            removeOne: removeOne
        };

        return service;

        ////////////

        function getAll() {
            return alertsList;
        }

        function getPublic() {
            return firebaseDataService.getFirebaseArray(database + '/public' );
        }

        function getOwn(currentUser) {
            return firebaseDataService.getFirebaseArray(database + '/public/' + currentUser.uid);
        }

        function getOne(currentUser, key) {
            if (currentUser){
                return firebaseDataService.getFirebaseObject(database + '/private/' + currentUser.uid + '/' + key);
            }else {
                return firebaseDataService.getFirebaseObject(database + '/public/*/' + key);
            }
        }

        function addOne(currentUser, type, newObject) {
            return firebaseDataService.getFirebaseObject(database + '/' + type + '/' + currentUser.uid).$add(newObject);
        }

        function removeOne(currentUser, type, key) {
            return firebaseDataService.getFirebaseObject(database + '/' + type + '/' + currentUser.uid).remove(key);
        }

    }

})(angular);
