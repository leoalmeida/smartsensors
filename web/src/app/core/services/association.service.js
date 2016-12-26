(function(angular) {
    'use strict';

    angular
        .module('app.core')
        .factory('associationDataService', associationDataService);

    associationDataService.$inject = ['firebase', '$firebaseObject', '$firebaseArray'];

    function associationDataService(firebase, $firebaseObject, $firebaseArray) {
        var root = new firebase.database();
        var database = "associations"

        var service = {
            associationAdd: associationAdd,
            associationTypeChange: associationTypeChange,
            associationDelete: associationDelete
        };

        return service;

        var associationAdd = function(id1, atype, id2, time, data){
            if (!id1 | !atype | !id2 | !time | !data) return "Error";
            return $firebaseObject(root.ref(database));
        };

        var associationTypeChange = function(id1, atype, id2, newtype){
            if (!id1 | !atype | !id2 | !newtype) return "Error";
            return $firebaseObject(root.ref(database));
        };

        var associationDelete = function(id1, atype, id2){
            if (!id1 | !atype | !id2) return "Error";
            return $firebaseArray(root.ref(database).child(id));
        };
    }

})(angular);
