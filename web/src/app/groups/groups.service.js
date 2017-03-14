(function(angular) {
    'use strict';

    angular
        .module('app.groups')
        .factory('GroupsService', GroupsService);

    GroupsService.$inject = ['firebaseDataService', '$filter'];

    function GroupsService(firebaseDataService, $filter) {

        var associationsList = "";
        var configRef = firebaseDataService.configurations;

        var service = {
            getSubscribes: getSubscribes,
            getGroup: getGroup,
            getPublicGroups: getPublicGroups,
            getAssociations: getAssociations,
            setAssociation: setAssocitation,
            removeAssocitation: removeAssocitation,
            getAll: getAll,
            getPublic: getPublic,
            getOne: getOne,
            addOne: addOne,
            removeOne: removeOne
        };

        return service;

        ////////////

        function getSubscribes(database, userid, first) {
            if (!associationsList) associationsList = firebaseDataService.getObjectsFirebaseArray(database, userid, first);
            return associationsList;
        }
        function getGroup(groupid) {
            return firebaseDataService.getObjectItemFirebase(groupid);
        }

        function getAssociations(database, itemID, first) {
            return firebaseDataService.getObjectsFirebaseArray(database, itemID, first);
        }

        function setAssocitation(type, data, userid, groupid) {
            return firebaseDataService.addNewAssociation(type, data, userid, groupid);
        }

        function removeAssocitation(key, list) {
            return firebaseDataService.delAssociationObject(key, list);
        }

        function getPublicGroups (){
            return firebaseDataService.getObjectsFirebaseArray("objects", "group");
        }

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
