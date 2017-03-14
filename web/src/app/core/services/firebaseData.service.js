(function(angular) {
    'use strict';

    angular
        .module('app.core')
        .factory('firebaseDataService', firebaseDataService);

    firebaseDataService.$inject = ['firebase', '$firebaseObject', '$firebaseArray'];

    function firebaseDataService(firebase, $firebaseObject, $firebaseArray) {
        var root = new firebase.database();

        var FactoryWithCounter = $firebaseArray.$extend({
            // add a method to the prototype that returns our counter
            getUpdateCount: function() { return this._counter; },

            // each time an update arrives from the server, apply the change locally
            $$added: function(snap) {
                // apply the changes using the super method
                var changed = $firebaseArray.prototype.$$added.apply(this, arguments);

                // add / increment a counter each time there is an update
                if( !this._counter ) { this._counter = 0; }
                this._counter++;

                // return whether or not changes occurred
                return changed;
            },
            $$removed: function(snap) {
                // apply the changes using the super method
                var changed = $firebaseArray.prototype.$$removed.apply(this, arguments);

                // add / increment a counter each time there is an update
                if( !this._counter ) { this._counter = 0; }
                this._counter--;

                // return whether or not changes occurred
                return changed;
            }
        });

        var service = {
            getObjectItemFirebase:  firebaseObjectItem,
            getObjectsFirebaseArray: firebaseArrayObjects,
            addNewAssociation:  firebaseNewAssociation,
            addNewObject:  firebaseNewObject,
            editObject:  firebaseEditObject,
            delAssociationObject:  firebaseRemoveAssociation,
            getFirebaseObject:  firebaseObject,
            getRefFirebaseObject:  refFirebaseObject,
            getFirebaseArray: firebaseArray,
            getRefFirebaseArray: refFirebaseArray,
            actuators: 'actuators',
            subscriptions: 'subscriptions',
            recipes: 'recipes',
            alerts: 'alerts',
            groups: 'group',
            subscribes: 'subscribe',
            sensors: 'sensors',
            sinks: 'sinks',
            info: 'info',
            readings: firebaseObject('readings'),
            configurations: firebaseObject('configurations'),
            mapinfo: firebaseObject('map-info'),
            textMessages: firebaseObject('textMessages'),
            users: firebaseObject('users')
        };

        return service;

        function firebaseObjectItem(objectid){
            return $firebaseObject(root.ref("objects").child(objectid));
        };

        function firebaseArrayObjects(database, child, first) {
            if (first == null)
                return FactoryWithCounter(root.ref().child(database).orderByChild(database.charAt(0) + "type").equalTo(child));
            else if (first)
                return FactoryWithCounter(root.ref().child("associations").orderByChild("atype_objid").equalTo(database+ "_" +child));
            else
                return FactoryWithCounter(root.ref().child("associations").orderByChild("atype_objid2").equalTo(database+ "_" +child));
        };

        function firebaseNewAssociation(type, data, objid, objid2){

            var newObject = {
                atype: type,
                aaccess: 'public',
                atype_objid: type + "_" + objid,
                atype_objid2: type + "_" + objid2,
                data: data,
                objid: objid,
                objid2: objid2,
                time: Date.now()
            };

            var list = $firebaseArray(root.ref("associations"));
            list.$add(newObject)
                .then(function(ref) {
                    var id = ref.key;
                    console.log("added record with id " + id);
                    list.$indexFor(id); // returns location in the array
                }, function(error) {
                    console.log("Error:", error);
                });

            return list
        };

        function firebaseRemoveAssociation(key, list){
            list.$remove(list.$getRecord(key)).then(function() {
                console.log("Item removido");
            }, function(error) {
                console.log("Error:", error);
            });
        };

        function firebaseNewObject(type, data, objid){
            var newObject = {
                otype: type,
                data: data,
                objid: objid,
                oaccess: 'public',
                time: Date.now()
            };
            return $firebaseArray(root.ref("objects")).$add(newObject);
        };

        function firebaseEditObject(data, objid){
            return $firebaseObject(root.ref("objects")
                .child(objid))
                .$loaded(function (snapshot) {
                    snapshot.data = data;
                    snapshot.$save();
                });
        };

        function firebaseObject(database){
            return $firebaseObject(root.ref().child(database));
        };
        function firebaseArray(database, child) {
            if (child == null) return $firebaseArray(root.ref(database));
            return $firebaseArray(root.ref(database).child(child));
        };

        function refFirebaseObject(database, child){
            return $firebaseObject(root.ref(database).child("public/" + child));
        };
        function refFirebaseArray(database, where, to){
            if (to != undefined && where != undefined){
                return $firebaseArray(root.ref(database + "/public").orderByChild(where).equalTo(to));
            }else{
                return $firebaseArray(root.ref(database + "/public"));
            }
        };
    }

})(angular);
