(function(angular) {
    'use strict';

    angular
        .module('app.core')
        .factory('firebaseDataService', firebaseDataService);

    firebaseDataService.$inject = ['firebase', '$firebaseObject', '$firebaseArray'];

    function firebaseDataService(firebase, $firebaseObject, $firebaseArray) {
        let root = new firebase.database().ref();
        let firebaseObject = (database, key) => {
          return $firebaseObject(root.child(database));
        };
        let filteredFirebaseArray = (database, key) => {
          let query = root.child(database).child(key);
          return $firebaseArray(query);
        };
        let fullFirebaseArray = (database) => {return $firebaseArray(root.child(database))}

        var service = {
            getFirebaseObject: firebaseObject,
            getFilteredArray: filteredFirebaseArray,
            getFullArray: fullFirebaseArray,
            readings: 'readings',
            friends: 'friends',
            alerts: 'alerts',
            configurations: 'configurations',
            emails: 'emails',
            textMessages: 'textMessages',
            groups: 'groups',
            mapinfo: 'map-info',
            sensors: 'sensors',
            subscribers: 'subscribers',
            users: 'users'
        };

        return service;
    }

})(angular);
