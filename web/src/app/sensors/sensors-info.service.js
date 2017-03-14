(function(angular) {
    'use strict';

    angular
      .module('app.sensors')
      .factory('SensorsService', SensorsService);
      // .factory('SensorsSocket', SensorsSocket);


    SensorsSocket.$inject = ['socketFactory'];
    function SensorsSocket (socketFactory) {
            return socketFactory();
    };

    // UserService.$inject = ['$http', 'API'];
    // function UserService($http, API) {
    SensorsService.$inject = ['firebaseDataService'];

    function SensorsService(firebaseDataService) {

        var database = firebaseDataService.sensors;
        var sensorsList = firebaseDataService.getRefFirebaseArray(database);
        var configRef = firebaseDataService.configurations;

        var service = {
            getSensor: getSensor,
            getPublicSensors: getPublicSensors,
            getSensorsFromSink: getSensorsFromSink,
            getAssociations: getAssociations,
            setAssociation: setAssocitation,
            setObject: setObject,
            getAll: getAll,
            getPublic: getPublic,
            getOwn: getOwn,
            getFromSink: getFromSink,
            getOne: getOne,
            addOne: addOne,
            removeOne: removeOne,
            getAllConfigurations: getAllConfigurations,
            getOwnSinks: getOwnSinks,
            getSinkStatus: getSinkStatus
        };

        return service;

        function getSensorsFromSink(database, sinkKey, first){
            return getAssociations("connected", sinkKey, true);
        }

        function getPublicSensors() {
            return firebaseDataService.getObjectsFirebaseArray("objects", "sensor");
        }

        function getSensor(sensorid) {
            return firebaseDataService.getObjectItemFirebase(sensorid);
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
            return sensorsList;
        }

        function getPublic() {
            return firebaseDataService.getFirebaseArray(database + '/public' );
        }

        function getOwn(currentUser) {
            //return firebaseDataService.getFirebaseArray(database + '/public/', currentUser.uid);
            return firebaseDataService.getRefFirebaseArray(database, 'owner', currentUser.uid);
        }

        function getFromSink(sinkKey){
            return firebaseDataService.getRefFirebaseArray(database, 'connectedSink/id', sinkKey);
        }

        function getOne(key) {
            return firebaseDataService.getRefFirebaseObject(database, key);
        }

        function getSinkStatus(type, currentUser, location) {
            return firebaseDataService.getFirebaseObject(database + '/' + type + '/' + currentUser.uid + '/' + location + '/connected');
        }

        function addOne(type, newObject) {
//            firebaseDataService.getFirebaseArray('sinks/' + currentUser.uid + '/' + location + '/sensors/').$save();
            return firebaseDataService.getFirebaseArray(database + '/' + type ).$add(newObject);
        }

        function removeOne(currentUser, type, location, key) {
            return firebaseDataService.getFirebaseObject(database + '/' + type ).remove(key);
        }

        function removeOneSink(currentUser, type, key) {
            return firebaseDataService.getFirebaseObject(database + '/' + type + '/' + currentUser.uid).remove(key);
        }

        function getAllConfigurations() {
            return configRef;
        }

        function getOwnSinks(currentUser) {
            return firebaseDataService.getFirebaseArray(database + '/' + type + '/' + currentUser.uid);
        }

        /* service.save = function(contact) {
            if (contact._id){
                return $http.post(API.friends + contact._id, contact);
            } else {
                return $http.post(API.friends, contact);
            }

        };

        service.getById = function(id) {
            return $http.get(API.friends + id);
        };

        service.getAll = function(query) {
            return $http.get(API.friends, {
                params: query
            });
        };

        service.remove = function(id) {
            return $http.delete(API.friends + id);
        };


        return service;
        */
    }

})(angular);
