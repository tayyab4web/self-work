angular.module("myApp")
        .service('firebaseS', function () {
            var config = {
                apiKey: "AIzaSyDk9OhFogojRuh0GaTZa0obs2V654iFxvU",
                authDomain: "ngloginsys.firebaseapp.com",
                databaseURL: "https://ngloginsys.firebaseio.com",
                projectId: "ngloginsys",
                storageBucket: "ngloginsys.appspot.com",
                messagingSenderId: "1044954933136"
            };
            this.getFirebaseInstance = firebase.initializeApp(config);
            this.getFirebaseDatabase = firebase.database();

        });


        