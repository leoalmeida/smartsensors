(function() {
    'use strict';

    angular
        .module('app.alerts')
        .factory('AlertService', AlertService);

    AlertService.$inject = ['firebaseDataService'];

    function AlertService(firebaseDataService) {

        var service = {
            getAll: getAll,
            getOne: getOne,
            addOne: addOne,
            updateOne: updateOne,
            removeOne: removeOne
        };

        return service;

        ////////////

        function getAll() {
            return firebaseDataService.getFullArray(firebaseDataService.alerts);
        }

        function getOne(key) {
            return firebaseDataService.getFilteredArray(firebaseDataService.alerts, key);
        }

        function addOne(newObject) {
            firebaseDataService.alerts.push({
                alert: newObject
            });
        }

        function updateOne(newObject) {
            return firebaseDataService.alerts.update({
                alert: newObject
            });
        }

        function removeOne(key) {
            firebaseDataService.alerts.remove({
                _id: key
            });
        }

    }

})();
