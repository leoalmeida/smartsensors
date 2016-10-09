(function() {
    'use strict';

    angular
        .module('app.groups')
        .factory('SubscriptionsService', SubscriptionsService);

    SubscriptionsService.$inject = ['firebaseDataService'];

    function SubscriptionsService(firebaseDataService) {

        var subscriptionsRef = firebaseDataService.subscriptions;
        var database = subscriptionsRef.$id;
        var subscriptionsList = firebaseDataService.getFirebaseArray(subscriptionsRef.$id);
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

        function addOne(newObject) {
            return firebaseDataService.getFirebaseObject(database).$add(newObject);
        }

        function removeOne(key) {
            return firebaseDataService.getFirebaseObject(database).remove(key);
        }

    }

})();
