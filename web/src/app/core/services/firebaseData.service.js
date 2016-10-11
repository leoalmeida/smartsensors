(function(angular) {
    'use strict';

    angular
        .module('app.core')
        .factory('firebaseDataService', firebaseDataService);

    firebaseDataService.$inject = ['firebase', '$firebaseObject', '$firebaseArray'];

    function firebaseDataService(firebase, $firebaseObject, $firebaseArray) {
        var root = new firebase.database();

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
            return $firebaseObject(root.ref().child(database));
        };
        function firebaseArray(database, child) {
            if (child == null) return $firebaseArray(root.ref(database));
            return $firebaseArray(root.ref(database).child(child));
        };
    }

})(angular);
