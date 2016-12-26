(function(angular) {
    'use strict';

    angular
        .module('app.core')
        .factory('objectDataService', objectDataService);

    objectDataService.$inject = ['firebase', '$firebaseObject', '$firebaseArray'];

    function objectDataService(firebase, $firebaseObject, $firebaseArray) {
        var root = new firebase.database();
        var database = "objects"

        var service = {
            objectAdd: objectAdd,
            objectUpdate: objectUpdate,
            objectGet: objectGet,
            objectDelete: objectDelete
        };

        return service;

        var objectAdd = function(object){
            return $firebaseObject(root.ref(database));
        };

        var objectUpdate = function(object, id){
            if (!object | !id) return "Error";
            return $firebaseObject(root.ref(database));
        };

        var objectGet = function(id){
            if (!id) return "Error";
            return $firebaseArray(root.ref(database).child(id));
        };

        var objectDelete = function(id){
            if (!id) return "Error";
            return $firebaseObject(root.ref(database).child(id));
        };
    }

})(angular);
