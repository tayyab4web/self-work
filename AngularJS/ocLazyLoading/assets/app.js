//main
var app = angular.module("app", ['ui.router', 'oc.lazyLoad']);
//config
app.config(['$ocLazyLoadProvider', '$stateProvider', '$urlRouterProvider', function ($ocLazyLoadProvider, $stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/home");

        //Config For ocLazyLoading
        $ocLazyLoadProvider.config({
            'debug': true, // For debugging 'true/false'
            'events': true, // For Event 'true/false'
            'modules': [{// Set modules initially
                    name: 'home', // State1 module
                    files: ['assets/components/home/homeCtrl.js']
                }, {
                    name: 'other', // State2 module
                    files: ['assets/components/other/otherCtrl.js']
                }]
        });

        //Config/states of UI Router
        $stateProvider
                .state('home', {
                    url: "/home",
                    views: {
                        "": {
                            templateUrl: "assets/components/home/homeView.html"
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load('home'); // Resolve promise and load before view 
                            }]
                    }
                })
                .state('other', {
                    url: "/other",
                    views: {
                        "": {
                            templateUrl: "assets/components/other/otherView.html"
                        }
                    },
                    resolve: {
                        loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                                return $ocLazyLoad.load('other'); // Resolve promise and load before view 
                            }]
                    }
                });
    }]);