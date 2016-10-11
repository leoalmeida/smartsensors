(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('AuthService', AuthService);

    AuthService.$inject = ['$rootScope', 'firebase', '$firebaseAuth', '$firebaseArray'];

    function AuthService($rootScope, firebase, $firebaseAuth, $firebaseArray) {

        var root = new firebase.database().ref();
        var authObj = $firebaseAuth();
        var usersList = $firebaseArray(root.child('users'));

        this.user = authObj.currentUser;

        var service = {
            firebaseAuthObject: authObj,
            googlelogin: toggleGoogleSignIn,
            clearCredentials: clearCredentials,
            updateUser: updateUser,
            sendWelcomeEmail: sendWelcomeEmail,
            isLoggedIn: authObj.$getAuth()
        };

        return service;

        /* function register(user) {
            return firebaseAuthObject.$createUserWithEmailAndPassword(user.email, user.password);
        }*/
        function updateUser(newObject) {
            var updated = [];
            //updated[newObject.uid] = usersList.$getRecord(newObject.uid)
            //if (!updated[newObject.uid]){
                updated[newObject.uid] = newObject;
                updated = usersList.$add(updated);
            //}
            return updated;
        }

        function toggleGoogleSignIn() {
            authObj.$signInWithRedirect("google").then(function(authData){})
                .catch(function(error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // The email of the user's account used.
                    var email = error.email;
                    // The firebase.auth.AuthCredential type that was used.
                    var credential = error.credential;
                    // [START_EXCLUDE]
                    if (errorCode === 'auth/account-exists-with-different-credential') {
                        alert('You have already signed up with a different auth provider for that email.');
                        // If you are using multiple auth providers on your app you should handle linking
                        // the user's accounts here.
                    } else {
                        console.error(error);
                    }
                });
        }

        function sendWelcomeEmail(emailAddress) {
            firebaseDataService.emails.push({
                emailAddress: emailAddress
            });
        }

        function clearCredentials() {
            $rootScope.globals = {};
            // $cookieStore.remove('globals');
        }
    };

})();