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
            readings: firebaseObject('readings'),
            friends: firebaseObject('friends'),
            alerts: firebaseObject('alerts'),
            configurations: firebaseObject('configurations'),
            emails: firebaseObject('emails'),
            textMessages: firebaseObject('textMessages'),
            groups: firebaseObject('groups'),
            mapinfo: firebaseObject('map-info'),
            sensors: firebaseObject('sensors'),
            subscribers: firebaseObject('subscribers'),
            users: firebaseObject('users')
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
