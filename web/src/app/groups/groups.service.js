(function(angular) {
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
            getPublic: getPublic,
            getOwn: getOwn,
            getOne: getOne,
            addOne: addOne,
            removeOne: removeOne
        };

        return service;

        ////////////

        function getAll() {
            return groupsList;
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

        function addOne(type, newObject) {
            return firebaseDataService.getFirebaseObject(database + '/' + type).$add(newObject);
        }

        function removeOne(type, key) {
            return firebaseDataService.getFirebaseObject(database + '/' + type).remove(key);
        }

    }

})(angular);
