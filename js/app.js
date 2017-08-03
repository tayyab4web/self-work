var myApp = angular.module("myApp", ['ngRoute', 'firebase','ngCookies']);
myApp.constant("FIREBASE_URL", "https://ngloginsys.firebaseio.com/");
myApp.run(['$rootScope', '$location', 'authenticationS', function ($rootScope, $location, authenticationS) {
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            if (next.$$route.authenticated) {
                if (authenticationS.requireAuth() === null) {
                    $rootScope.message = "You must loged in to access this page";
                    $location.path("/login");
                }
            }
        });
    }]);
myApp.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
                .when('/login', {
                    templateUrl: 'views/login.html',
                    controller: 'registrationCtrl'
                })
                .when('/register', {
                    templateUrl: 'views/register.html',
                    controller: 'registrationCtrl'
                })
                .when('/success', {
                    templateUrl: 'views/success.html',
                    controller: 'successCtrl',
                    authenticated: true
                })
                .otherwise({
                    redirectTo: '/login'
                });

    }]);
myApp.controller("myAppCtrl", ['$scope', function ($scope) {
        //$scope.message = "This is angular js app";
    }]);