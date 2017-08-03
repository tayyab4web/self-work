angular.module("sportsStore").
        constant("dataUrl", "http://localhost:5500/products")
        .constant("orderUrl", "http://localhost:5500/orders")
        .controller("sportsStoreCtrl", function ($scope, $http, $location, dataUrl, orderUrl,cart) {
            $scope.data = {};
            $http.get(dataUrl).then(function (response) {
                var jsonString = angular.toJson(response.data);
                $scope.data.products = angular.fromJson(jsonString);
            }, function (error) {
                //error
                //console.log(error);
                $scope.data.error = error;
            });
            $scope.sendOrder = function (shippingDetails) {
                var order = angular.copy(shippingDetails);
                order.products = cart.getProducts();
                $http.post(orderUrl, order)
                        .success(function (response) {
                            $scope.data.orderId = response.id;
                            cart.getProducts().length = 0;
                        })
                        .error(function (error) {
                            $scope.data.orderError = error;
                        })
                        .finally(function () {
                            $location.path("/complete");
                        });
            };
        });
