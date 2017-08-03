angular.module("myApp")
        .factory("authenticationS", ['$rootScope', '$window', '$location', 'firebaseS', function ($rootScope, $window, $location, firebaseS) {
                //check either user  logedIn or not
                $rootScope.$apply(function () {
                    if ($window.localStorage.getItem("firebase:authUser:AIzaSyDk9OhFogojRuh0GaTZa0obs2V654iFxvU:[DEFAULT]") !== null) {
                        var firebaseData = angular.fromJson($window.localStorage.getItem("firebase:authUser:AIzaSyDk9OhFogojRuh0GaTZa0obs2V654iFxvU:[DEFAULT]"));
                        $rootScope.firebaseUser = firebaseData;
                        $rootScope.firebaseUser.uid = firebaseData.uid;
                        $rootScope.firebaseUser.displayName = firebaseData.displayName;

                    }
                });//$apply digest cycle

                //wirte user profile data
                function writeUserData(user, userId) {
                    firebaseS.getFirebaseDatabase.ref('users/' + userId).set({
                        datetime: firebase.database.ServerValue.TIMESTAMP,
                        username: user.username,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        email: user.email
                    });
                }//writeUserData

                var myObj = {
                    login: function (user) {
                        var email = user.email;
                        var password = user.password;
                        firebaseS
                                .getFirebaseInstance
                                .auth()
                                .signInWithEmailAndPassword(email, password)
                                .then(function (logedInUser) {
                                    var currentUser = firebaseS.getFirebaseInstance.auth().currentUser;
                                    var displayName = currentUser.displayName;
                                    //console.log(displayName);
                                    $rootScope.$apply(function () {
                                        if ($window.localStorage.getItem("firebase:authUser:AIzaSyDk9OhFogojRuh0GaTZa0obs2V654iFxvU:[DEFAULT]") !== null) {
                                            var firebaseData = angular.fromJson($window.localStorage.getItem("firebase:authUser:AIzaSyDk9OhFogojRuh0GaTZa0obs2V654iFxvU:[DEFAULT]"));
                                            $rootScope.firebaseUser = firebaseData;
                                            $rootScope.firebaseUser.uid = firebaseData.uid;
                                            $rootScope.firebaseUser.displayName = firebaseData.displayName;

                                        }
                                        if ($rootScope.firebaseUser.uid) {
                                            $location.path("/success");
                                        }

//                                        if (currentUser) {
//                                            
//
//                                            $location.path("/success");
//
//                                        } else {
//                                            // No user is signed in.
//                                        }
                                    });
                                })
                                .catch(function (error) {
                                    // Handle Errors here.
                                    var errorCode = error.code;
                                    var errorMessage = error.message;
                                    $rootScope.$apply(function () {
                                        $rootScope.message = errorMessage;
                                    });
                                    // ...
                                });



                    }, //login

                    logout: function () {
                        //console.log("logging out...");
                        firebaseS.getFirebaseInstance.auth().signOut().then(function () {
                            // Sign-out successful.
                            $rootScope.$apply(function () {
                                if ($rootScope.firebaseUser.uid) {
                                    $window.location.reload();
                                }
                                $location.path('/login');
                            });
                        }).catch(function (error) {
                            // An error happened.
                            $rootScope.$apply(function () {
                                console.log(error);
                                $rootScope.message = error;
                            });

                        });//logout

                    },
                    register: function (user) {
                        var email = user.email;
                        var password = user.password;
                        firebaseS
                                .getFirebaseInstance
                                .auth()
                                .createUserWithEmailAndPassword(email, password)
                                .then(function (regdUser) {
                                    var currentUser = firebaseS.getFirebaseInstance.auth().currentUser;
                                    var userId = currentUser.uid;
                                    //var user = firebase.auth().currentUser;

                                    currentUser.updateProfile({
                                        displayName: user.firstname
                                                //photoURL: "https://example.com/jane-q-user/profile.jpg"
                                    }).then(function () {
                                        // Update successful.
                                        //console.log("display name is set");
                                    }, function (error) {
                                        // An error happened.
                                        //console.log("not set")
                                    });
                                    writeUserData(user, userId);
                                    $rootScope.$apply(function () {
                                        //console.log(regdUser);
                                        //$rootScope.message = "Hi " + user.firstname + ", Thankyou for registration.";
                                    });
                                    //perform login user
                                    myObj.login(user);

                                })//success promise
                                .catch(function (error) {
                                    // Handle Errors here.
                                    var errorCode = error.code;
                                    var errorMessage = error.message;
                                    $rootScope.$apply(function () {
                                        $rootScope.message = errorMessage;
                                        //console.log(errorMessage);
                                    });


                                });//error promise
                    }, //register
                    requireAuth: function () {
                        return firebaseS.getFirebaseInstance.auth().currentUser;
                    }//requireAuth
                };
                return myObj;
            }]);
