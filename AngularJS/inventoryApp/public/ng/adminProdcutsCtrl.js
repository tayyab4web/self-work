angular.module("inventoryAdmin")
        .constant("productsUrl", "http://localhost:8080/current-products/")
        .config(function ($httpProvider) {
            $httpProvider.defaults.withCredentials = true;
        })
        .controller("productCtrl", function ($scope, $resource, productsUrl) {
            $scope.productsResource = $resource(productsUrl + ":id", {id: "@id"});
            $scope.listProducts = function () {
                $scope.products = $scope.productsResource.query();
            };
            $scope.deleteProduct = function (product) {
                product.$delete().then(function () {
                    $scope.products.splice($scope.products.indexOf(product), 1);
                });

            };
            $scope.createProduct = function (product) {
                new $scope.productsResource(product).$save().then(function (product) {
                    $scope.products.push(product);
                    $scope.editedProduct = null;
                });
            };
            $scope.updateProduct = function (product) {
                product.$save();
                $scope.editedProduct = null;
            };
            $scope.startEditProduct = function (product) {
                $scope.editedProduct = product;
            };
            $scope.cancelEditProduct = function (product) {
                $scope.editedProduct = null;
                $scope.listProducts();
            };
            $scope.listProducts();
        });