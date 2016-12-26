(function(angular) {
    'use strict';

    angular
        .module('app.recipes')
        .factory('RecipesService', RecipesService);

    RecipesService.$inject = ['firebaseDataService', '$firebaseArray'];

    function RecipesService(firebaseDataService, $firebaseArray) {

        var recipesRef = firebaseDataService.recipes;
        var database = recipesRef.$id;
        var recipesList = firebaseDataService.getFirebaseArray(database);
        var configRef = firebaseDataService.configurations;


        var service = {
            getAll: getAll,
            getPublic: getPublic,
            getOwn: getOwn,
            getOne: getOne,
            addOne: addOne,
            removeOne: removeOne
        };

        return service;

        ////////////

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
