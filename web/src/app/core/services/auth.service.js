(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('AuthService', AuthService);

    AuthService.$inject = ['firebase', 'firebaseDataService'];

    function AuthService(firebase, firebaseDataService) {
        let firebaseAuthObject = firebase.auth();
        this.user = firebaseAuthObject.currentUser;
        this.credential = null;

        var service = {
            firebaseAuthObject: firebaseAuthObject,
            googlelogin: toggleGoogleSignIn,
            logout: logout,
            isLoggedIn: isLoggedIn,
            sendWelcomeEmail: sendWelcomeEmail
        };

        return service;

        /* function register(user) {
            return firebaseAuthObject.$createUserWithEmailAndPassword(user.email, user.password);
        }*/

        function toggleGoogleSignIn() {

            if (!firebaseAuthObject.currentUser) {
                let provider = new firebase.auth.GoogleAuthProvider();
                provider.addScope('https://www.googleapis.com/auth/plus.login');

                firebaseAuthObject.signInWithPopup(provider).then(function(result) {
                    this.credential = result.credential;
                    this.user = result.user;
                    firebaseDataService.getFullArray(firebaseDataService.users).$add(this.user);
                }).catch(function(error) {
                    let errorCode = error.code;
                    let errorMessage = error.message;
                    // The email of the user's account used.
                    let email = error.email;
                    // The firebase.auth.AuthCredential type that was used.
                    let credential = error.credential;
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
                // [START signout]
                firebaseAuthObject.signOut();
                // [END signout]
            }
            // [START_EXCLUDE]
            document.getElementById('quickstart-sign-in').disabled = true;
            // [END_EXCLUDE]
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