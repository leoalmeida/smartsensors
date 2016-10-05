(function() {
    'use strict';

    angular
        .module('app.groups')
        .factory('GroupsService', GroupsService);

    GroupsService.$inject = ['firebaseDataService'];

    function GroupsService(firebaseDataService) {

        var groupsRef = firebaseDataService.groups;
        var database = groupsRef.$id;
        var groupsList = firebaseDataService.getFirebaseArray(groupsRef.$id);
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
            return groupsList;
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
