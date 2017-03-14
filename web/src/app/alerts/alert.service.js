(function(angular) {
    'use strict';

    angular
        .module('app.alerts')
        .factory('AlertService', AlertService);

    AlertService.$inject = ['firebaseDataService'];

    function AlertService(firebaseDataService) {

        var database = firebaseDataService.alerts;

        var subscribesList = "";

        var configRef = firebaseDataService.configurations;


        var service = {
            getPublic: getPublic,
            getSubscribes: getSubscribes,
            getAll: getAll,
            getGroup: getGroup,
            getOwn: getOwn,
            getOne: getOne,
            addOne: addOne,
            removeOne: removeOne
        };

        return service;

        ////////////

        function getSubscribes(userid) {
            if (!subscribesList) subscribesList = firebaseDataService.getObjectsFirebaseArray(firebaseDataService.subscribes, userid);
            return subscribesList;
        }
        function getGroup(groupid) {
            return firebaseDataService.getObjectItemFirebase(groupid);
        }

        function getAll() {
            return alertsList;
        }

        function getPublic() {
            return firebaseDataService.getObjectsRefFirebaseArray("associations", database);
        }

        function getOwn(currentUser) {
            return firebaseDataService.getObjectsRefFirebaseArray("association", database, 'owner', currentUser.uid);
        }

        function getOne(currentUser, key) {
            if (currentUser){
                return firebaseDataService.getObjectsFirebase(database + '/private/' + currentUser.uid + '/' + key);
            }else {
                //return firebaseDataService.getObjectsFirebase(database + '/public/' + key);
                return firebaseDataService.getObjectsRefFirebase(database, key);
            }
        }

        function addOne(currentUser, type, newObject) {
            return firebaseDataService.getObjectsFirebase(database + '/' + type + '/' + currentUser.uid).$add(newObject);
        }

        function removeOne(currentUser, type, key) {
            return firebaseDataService.getObjectsFirebase(database + '/' + type + '/' + currentUser.uid).remove(key);
        }

    }

})(angular);
