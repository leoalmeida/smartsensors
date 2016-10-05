(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('AuthService', AuthService);

    AuthService.$inject = ['firebase', 'firebaseDataService'];

    function AuthService(firebase, firebaseDataService) {

        var usersRef = firebaseDataService.users;

        var firebaseAuthObject = firebase.auth();
        this.user = firebaseAuthObject.currentUser;
        this.credential = null;

        var service = {
            firebaseAuthObject: firebaseAuthObject,
            googlelogin: toggleGoogleSignIn,
            isLoggedIn: isLoggedIn,
            sendWelcomeEmail: sendWelcomeEmail
        };

        return service;

        /* function register(user) {
            return firebaseAuthObject.$createUserWithEmailAndPassword(user.email, user.password);
        }*/

        function addUser(newObject) {
            return firebaseDataService.getFirebaseArray(usersRef).$add(newObject);
        }

        function toggleGoogleSignIn() {

            if (!firebaseAuthObject.currentUser) {
                var provider = new firebase.auth.GoogleAuthProvider();
                provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
                provider.addScope('https://www.googleapis.com/auth/plus.me');
                provider.addScope('https://www.googleapis.com/auth/plus.login');
                provider.addScope('https://www.googleapis.com/auth/userinfo.email');
                provider.addScope('profile');
                provider.addScope('email');

                firebaseAuthObject.signInWithPopup(provider).then(function(result) {
                    this.credential = result.credential;
                    this.user = result.user;

                    addUser( this.user );

                }).catch(function(error) {
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
            } else {
                logout();
            }
        }

        function logout() {
            firebaseAuthObject.signOut()
                .then(function() {
                    console.log('loggedout');
            }, function(error) {
                console.log(error);
            });
        }

        function isLoggedIn() {
            return firebaseAuthObject.currentUser;
        }

        function sendWelcomeEmail(emailAddress) {
            firebaseDataService.emails.push({
                emailAddress: emailAddress
            });
        }

    }

})();