//main
var app = angular.module('app', ['ui.router']);
app.controller('appCtrl', ['$scope', function ($scope) {
        $scope.message = "welcome to angular App";
    }]);

//ui-routing
app.config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {
        //$urlRouterProvider.otherwise('/');

        $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'views/home.html',
                    controller: 'appCtrl'
                })
                .state('about', {
                    url: '/about',
                    templateUrl: 'views/about.html',
                    controller: 'appCtrl'
                })
                .state('work', {
                    url: '/work',
                    templateUrl: 'views/work.html',
                    controller: 'appCtrl'
                })
                .state('contact', {
                    url: '/contact',
                    templateUrl: 'views/contact.html',
                    controller: 'appCtrl'
                })
                




    }]);