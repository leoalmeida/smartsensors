(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('AuthService', AuthService)
        .factory('AuthRequestInterceptor', AuthRequestInterceptor)
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('AuthRequestInterceptor');
        });

    AuthRequestInterceptor.$inject = ['$q', '$location', '$base64'];

    function AuthRequestInterceptor($q, $location, $base64) {
        return {
            'request': function (config) {
                if (sessionStorage.getItem('accessToken')) {
                    console.log("token["+window.localStorage.getItem('accessToken')+"], config.headers: ", config.headers);

                    config.headers.Authorization = 'Basic ' + $base64.encode(sessionStorage.getItem('currentUserId')+":"+sessionStorage.getItem('accessToken'));
                }
                return config || $q.when(config);
            }
            ,
            responseError: function(rejection) {
                console.log("Found responseError: ", rejection);
                if (rejection.status == 401) {
                    console.log("Access denied (error 401), please login again");
                    //$location.nextAfterLogin = $location.path();
                    $location.path('/login');
                }
                return $q.reject(rejection);
            }
        }
    };

    AuthService.$inject = ['$location', '$rootScope', 'firebase', '$firebaseAuth', '$firebaseArray', '$firebaseObject'];

    function AuthService($location,$rootScope, firebase, $firebaseAuth, $firebaseArray, $firebaseObject) {

        var root = new firebase.database().ref('objects');
        //var root = new firebase.database().ref('users');
        var authObj = $firebaseAuth();

        this.user = authObj.currentUser;

        var service = {
            firebaseAuthObject: authObj,
            googlelogin: toggleGoogleSignIn,
            twitterlogin: toggleTwitterSignIn,
            facebooklogin: toggleFacebookSignIn,
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
            var uid = newObject.uid; var updated = [];

            var obj = $firebaseObject(root.child(uid));

            obj.$loaded().then( function (object) {
                if (!object.data.uid || object.data.token.value != newObject.refreshToken){
                    obj.data = {
                            "displayName": newObject.displayName,
                            "email": newObject.email,
                            "emailVerified": newObject.emailVerified,
                            "isAnonymous": newObject.isAnonymous,
                            "photoURL": newObject.photoURL,
                            "uid": uid,
                            "providerData": newObject.providerData,
                            "token": {
                                "value": newObject.refreshToken
                            }
                    };
                    updated = obj.$save();
                }
                sessionStorage.setItem('currentUserId', newObject.uid);
                sessionStorage.setItem('accessToken', newObject.refreshToken);
                sessionStorage.setItem('user', JSON.stringify(newObject));
                sessionStorage.setItem('anonymous', newObject.isAnonymous);
                $location.path('/home');
            });
            return updated;
        }

        function toggleGoogleSignIn() {
            authObj.$signInWithRedirect("google").then(function(authData){}).catch(function(error) {
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

        function toggleTwitterSignIn() {
            authObj.$signInWithRedirect("twitter").then(function(authData){}).catch(function(error) {
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

        function toggleFacebookSignIn() {

                authObj.$signInWithRedirect("facebook").then(function(authData){}).catch(function(error) {
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
            /*return new Promise(function(resolve, reject) {
                authObj.$signInWithPopup("facebook").then(function (result) {
                    console.log("Signed in as:", result.user.uid);
                    resolve(result)
                }, function (error) {
                    console.log("Authentication failed:", error);
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // The email of the user's account used.
                    var email = error.email;
                    // The firebase.auth.AuthCredential type that was used.
                    var credential = error.credential;
                    // [START_EXCLUDE]
                    if (errorCode === 'auth/account-exists-with-different-credential') {
                        console.log("Multiple accounts: ", JSON.stringify(error));
                        //alert('You have already signed up with a different auth provider for that email.');
                        console.log("Signed in as:", result.email);
                    } else {
                        console.error(error);
                    }
                    reject(error);
                });
            });*/
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