(function(angular) {
    'use strict';

    angular
        .module('app.core')
        .factory('associationListDataService', associationListDataService);

    associationListDataService.$inject = ['firebase', '$firebaseObject', '$firebaseArray'];

    function associationListDataService(firebase, $firebaseObject, $firebaseArray) {
        var root = new firebase.database();
        var database = "associations-list"

        var service = {
            associationListGet: associationListGet,
            associationListCount: associationListCount,
            associationListRange: associationListRange,
            associationListTimeRange: associationListTimeRange
        };

        return service;

        var associationListGet = function(id1, atype, id2set, high, low){
            if (!id1 | !atype | !id2set ) return "Error";
            return $firebaseArray(root.ref(database));
        };

        var associationListCount = function(id1, atype){
            if (!id1 | !atype ) return "Error";
            return $firebaseObject(root.ref(database));
        };

        var associationListRange = function(id1, atype, pos, limit){
            if (!id1 | !atype | !pos | !limit) return "Error";
            return $firebaseObject(root.ref(database).child(id));
        };

        var associationListTimeRange = function(id1, atype, high, low, limit){
            if (!id1 | !atype | !high | !low | !limit ) return "Error";
            return $firebaseObject(root.ref(database).child(id));
        };
    }

})(angular);
