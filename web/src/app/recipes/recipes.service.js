(function(angular) {
    'use strict';

    angular
        .module('app.recipes')
        .factory('RecipesService', RecipesService);

    RecipesService.$inject = ['firebaseDataService', '$firebaseArray'];

    function RecipesService(firebaseDataService, $firebaseArray) {

        var database = firebaseDataService.recipes;
        var recipesList = firebaseDataService.getFirebaseArray(database);
        var configRef = firebaseDataService.configurations;


        var service = {
            getAssociations: getAssociations,
            setAssociation: setAssocitation,
            setObject: setObject,
            getRecipe: getRecipe,
            getPublicRecipes: getPublicRecipes,
            getAll: getAll,
            getPublic: getPublic,
            getOwn: getOwn,
            getOne: getOne,
            addOne: addOne,
            removeOne: removeOne
        };

        return service;

        ////////////

        function getPublicRecipes (){
            return firebaseDataService.getObjectsFirebaseArray("objects", "recipe");
        }

        function getRecipe(id) {
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
            return recipesList;
        }

        function getPublic() {
            return firebaseDataService.getFirebaseArray(database + '/public' );
        }

        function getOne(key) {
            return firebaseDataService.getFirebaseObject(database + '/public/' + key);

        }

        function addOne(currentUser, type, newObject) {
            return firebaseDataService.getFirebaseArray(database + '/' + type ).$add(newObject);
        }

        function removeOne(currentUser, type, key) {
            return firebaseDataService.getFirebaseObject(database + '/' + type ).remove(key);
        }

        function getOwn(currentUser) {
            //return firebaseDataService.getFirebaseArray(database + '/private/' + currentUser.uid);
            return firebaseDataService.getFirebaseArray(database + '/public/', currentUser.uid);
        }

    }

})(angular);
