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
            getRefFirebaseObject:  refFirebaseObject,
            getFirebaseArray: firebaseArray,
            getRefFirebaseArray: refFirebaseArray,
            actuators: 'actuators',
            subscriptions: 'subscriptions',
            groups: firebaseObject('groups'),
            recipes: firebaseObject('recipes'),
            alerts: 'alerts',
            sensors: 'sensors',
            servers: 'servers',
            info: 'info',
            readings: firebaseObject('readings'),
            configurations: firebaseObject('configurations'),
            mapinfo: firebaseObject('map-info'),
            textMessages: firebaseObject('textMessages'),
            users: firebaseObject('users')
        };

        return service;

        function firebaseObject(database){
            return $firebaseObject(root.ref().child(database));
        };
        function firebaseArray(database, child) {
            if (child == null) return $firebaseArray(root.ref(database));
            return $firebaseArray(root.ref(database).child(child));
        };

        function refFirebaseObject(database, child){
            return $firebaseObject(root.ref(database).child("public/" + child));
        };
        function refFirebaseArray(database, where, to){
            if (to != undefined && where != undefined){
                return $firebaseArray(root.ref(database + "/public").orderByChild(where).equalTo(to));
            }else{
                return $firebaseArray(root.ref(database + "/public"));
            }
        };
    }

})(angular);
