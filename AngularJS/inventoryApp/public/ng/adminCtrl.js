angular.module("inventoryAdmin", ["ngRoute", "ngResource", "ui.bootstrap.datetimepicker"]).
        config(function ($routeProvider) {
            $routeProvider
                    .when("/login", {
                        templateUrl: "ngViews/adminLogin.html"
                    })
                    .when("/main", {
                        templateUrl: "ngViews/adminMain.html"
                    })
                    .otherwise({
                        redirectTo: "/login"
                    });
        });
/*-=-=-=-=-=-=-=-=-=-=-=-=-=-=-*/
angular.module("inventoryAdmin")
        .constant("authUrl", "http://localhost:8080/users/login")
        .constant("ordersUrl", "http://localhost:8080/orders")
        .controller("inventoryAdminCtrl", function ($scope, $http, $window, $location, authUrl) {
            $scope.authenticate = function (user, pass) {
                console.log("test");
                $http.post(authUrl, {
                    username: user,
                    password: pass
                }).then(function (data) {
                    $location.path("/main");
                }, function (error) {
                    $scope.authenticateError = error;
                });
            };
            $scope.gotoHome = function () {
                $window.location.href = '/index.html';
            };
        })

        .controller("mainCtrl", function ($scope) {
            $scope.screens = ["Current Products", "Sales Record"];
            $scope.current = $scope.screens[0];
            $scope.setScreen = function (index) {
                $scope.current = $scope.screens[index];
            };
            $scope.getScreen = function (index) {
                return $scope.current == "Current Products" ? "ngViews/currentProducts.html" : "ngViews/adminOrders.html";
            };

        })
        .controller("ordersCtrl", function ($scope, $http, ordersUrl) {
            $http.get(ordersUrl, {withCredentials: true})
                    .success(function (data) {
                        $scope.orders = data;
                    })
                    .error(function (error) {
                        $scope.error = error;
                    });
            $scope.selectedOrder;
            $scope.selectOrder = function (order) {
                $scope.selectedOrder = order;
            };
            $scope.calcTotal = function (order) {
                var total = 0;
                for (var i = 0; i < order.products.length; i++) {
                    total += (order.products[i].count * order.products[i].price);
                }
                return total;
            };
        });





