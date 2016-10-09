(function(angular) {
    'use strict';

    angular
        .module('app.core')
        .factory('firebaseDataService', firebaseDataService);

    firebaseDataService.$inject = ['firebase', '$firebaseObject', '$firebaseArray'];

    function firebaseDataService(firebase, $firebaseObject, $firebaseArray) {
        var root = new firebase.database().ref();

        var service = {
            getFirebaseObject:  firebaseObject,
            getFirebaseArray: firebaseArray,
            users: firebaseObject('users'),
            subscriptions: firebaseObject('subscriptions'),
            groups: firebaseObject('groups'),
            alerts: firebaseObject('alerts'),
            sensors: firebaseObject('sensors'),
            readings: firebaseObject('readings'),
            configurations: firebaseObject('configurations'),
            mapinfo: firebaseObject('map-info'),
            textMessages: firebaseObject('textMessages')
        };

        return service;

        function firebaseObject(database){
            return $firebaseObject(root.child(database));
        };
        function firebaseArray(database) {
            return $firebaseArray(root.child(database));
        };
    }

})(angular);
