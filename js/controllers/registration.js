angular.module("myApp")
        .controller("registrationCtrl", ['$rootScope', '$scope', 'authenticationS', function ($rootScope, $scope, authenticationS) {
                $scope.login = function () {
                    console.log("wait...");
                    authenticationS.login($scope.user);
                };//login
                
                $scope.logout = function (){
                    authenticationS.logout();
                };//logout
                
                $scope.register = function () {
                    authenticationS.register($scope.user);
                };//register
                

            }]);