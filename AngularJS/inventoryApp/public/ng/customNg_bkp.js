var inventoryApp = angular.module("inventoryApp", ["ngRoute", "ngResource"]);
inventoryApp.config(function ($routeProvider) {
    $routeProvider
            .when("/", {
                templateUrl: "ngViews/main.html"
            })
            .when("/setting", {
                templateUrl: "ngViews/setting.html"
            })
            .otherwise({
                templateUrl: "ngViews/main.html"
            });
});
inventoryApp.constant("productsUrl", "http://localhost:5500/current-products/");
inventoryApp.controller("inventoryAppCtrl", function ($scope, $http, $resource, $timeout, $element, productsUrl) {
    $http.get(productsUrl).then(function (response) {
        $scope.curr = response.data;
        $scope.selectedValue = $scope.curr[0].productName;
        var count = 1;
        $scope.products = [
            {count: count, selectedValue: $scope.selectedValue, price: "", quantity: "", discount: ""}
        ];
        $scope.addNewRow = function (event) {
            if (event.keyCode == 13) {
                count++;
                $scope.products.push({count: count, selectedValue: $scope.selectedValue, price: "", quantity: "", discount: ""});
            }
        };
        $scope.product = {};
        $scope.submitForm = function () {
            console.log($scope.product.price);
        }
    }, function (error) {
        //error handle
    });

});
inventoryApp.controller("settingCtrl", function ($scope) {

});