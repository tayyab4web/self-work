angular.module("sportsStoreAdmin")
        .constant("authUrl", "http://localhost:5500/users/login")
        .constant("ordersUrl", "http://localhost:5500/orders")
        .controller("sportsStoreAdminCtrl", function ($scope, $http, $location, authUrl) {
            $scope.authenticate = function (user, pass) {
                $http.post(authUrl, {
                    username: user,
                    password: pass
                }).success(function (data) {
                    $location.path("/main");
                }).error(function (error) {
                    $scope.authenticateError = error;
                });
            };
        })
        .controller("mainCtrl", function ($scope) {
            $scope.screens = ["products", "orders"];
            $scope.current = $scope.screens[0];
            $scope.setScreen = function (index) {
                $scope.current = $scope.screens[index];
            };
            $scope.getScreen = function (index) {
                return $scope.current == "products" ? "views/adminProducts.html" : "views/adminOrders.html";
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