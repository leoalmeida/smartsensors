(function() {
    'use strict';

    angular
        .module('app.groups')
        .factory('SubscriptionsService', SubscriptionsService);

    SubscriptionsService.$inject = ['firebaseDataService'];

    function SubscriptionsService(firebaseDataService) {

        var database = firebaseDataService.subscriptions;
        var subscriptionsList = firebaseDataService.getFirebaseArray(database);
        var configRef = firebaseDataService.configurations;


        var service = {
            getAssociations: getAssociations,
            setAssociation: setAssocitation,
            setObject: setObject,
            getAll: getAll,
            getOwn: getOwn,
            addOne: addOne,
            removeOne: removeOne
        };

        return service;

        ////////////

        function getAssociations(database, itemID, first) {
            return firebaseDataService.getObjectsFirebaseArray(database, itemID, first);
        }

        function setAssocitation(type, data, userid, groupid) {
            return firebaseDataService.addNewAssociation(type, data, userid, groupid);
        }

        function setObject(type, recipeData, objectid, modifyType) {
            if (modifyType === "edit")
                return firebaseDataService.editObject(recipeData, objectid);
            else {
                for (action of recipeData.actionContainer)
                    if (action.type === 'alert') {
                        firebaseDataService.addNewObject("group", action, objectid)
                            .then(function(ref) {
                                    firebaseDataService.addNewAssociation("publish", action, objectid, ref.key);
                                }
                            );
                    }
                return firebaseDataService.addNewObject(type, recipeData, objectid);
            }

        }

        function getAll() {
            return subscriptionsList;
        }

        function getOwn(currentUser) {
            return firebaseDataService.getFirebaseArray(database +  '/' + currentUser.uid);
        }

        function addOne(currentUser, newObject) {
            return firebaseDataService.getFirebaseArray(database + '/' + currentUser.uid).$add(newObject);
        }

        function removeOne(currentUser, key) {
            return firebaseDataService.getFirebaseArray(database + '/' + currentUser.uid).remove(key);
        }

    }

})();
