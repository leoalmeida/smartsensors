(function(angular) {
    'use strict';

    angular
      .module('app.sinks')
      .factory('SinksService', SinksService);
      // .factory('SinksSocket', SinksSocket);


    SinksSocket.$inject = ['socketFactory'];
    function SinksSocket (socketFactory) {
            return socketFactory();
    };

    // UserService.$inject = ['$http', 'API'];
    // function UserService($http, API) {
    SinksService.$inject = ['$location', '$http', 'API', 'firebaseDataService'];

    function SinksService($location, $http, API, firebaseDataService) {

        var database = firebaseDataService.sinks;
        var sinksList = firebaseDataService.getRefFirebaseArray(database, 'owner');
        var configRef = firebaseDataService.configurations;
        var associationsList = "";

        var service = {
            getOwnSinks: getOwnSinks,
            getObject: getObject,
            getPublicSinks: getPublicSinks,
            getAssociations: getAssociations,
            setAssociation: setAssocitation,
            setObject: setObject,
            getAll: getAll,
            getPublic: getPublic,
            getOwn: getOwn,
            getOne: getOne,
            addOne: addOne,
            removeOne: removeOne,
            getAllConfigurations: getAllConfigurations,
            getStatus: getStatus,
            startBoard: startBoard
        };

        return service;

        function getOwnSinks(database, userid, first) {
            if (!associationsList) associationsList = firebaseDataService.getObjectsFirebaseArray(database, userid, first);
            return associationsList;
        }

        function getPublicSinks (){
            return firebaseDataService.getObjectsFirebaseArray("objects", "sink");
        }


        function getObject(id) {
            return firebaseDataService.getObjectItemFirebase(id);
        }


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
            return sinksList;
        }

        function getPublic() {
            return firebaseDataService.getFirebaseArray(database + '/public' );
        }

        function getOwn(currentUser) {
            //return firebaseDataService.getFirebaseArray(database + '/public/', currentUser.uid);
            return firebaseDataService.getRefFirebaseArray(database, 'owner', currentUser.uid);
        }

        function getOne(type, currentUser, location, key) {
            //return firebaseDataService.getFirebaseObject(database + '/' + type + '/' + currentUser.uid + '/' + location + '/' + key);
            return firebaseDataService.getRefFirebaseObject(database, key);
        }

        function getStatus(type, key) {
            return firebaseDataService.getFirebaseObject(database + '/' + type + '/' + key);
        }

        function addOne(newObject) {
            return firebaseDataService.getFirebaseArray(database + '/public').$add(newObject);
        }

        function removeOne(currentUser, type, key) {
            return firebaseDataService.getFirebaseObject(database + '/' + type + '/' + currentUser.uid).remove(key);
        }

        function getAllConfigurations() {
            return configRef;
        }

        function startBoard(data, cbSuccess, cbError) {
            return $http.post(API.sinks.withkey + data.sink + '/startboard', data).then(cbSuccess, cbError);
        }

    }

})(angular);
