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
            getAll: getAll,
            getOwn: getOwn,
            addOne: addOne,
            removeOne: removeOne
        };

        return service;

        ////////////

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
