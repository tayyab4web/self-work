angular.module("inventoryApp")
        .constant("sellingsUrl", "http://localhost:8080/sellings/")
        .controller("listingSalesCtrl", function ($scope, $http, $resource, sellingsUrl) {
            $scope.grantTotal = 0;
            $scope.sortBy = ["Today", "This Month", "This Year", "View All"];
            $scope.viewSorted = $scope.sortBy[0];
            $scope.productsResource = $resource(sellingsUrl + ":id", {id: "@id"});
            $scope.listProducts = function () {
                $scope.products = $scope.productsResource.query();
                $scope.products = angular.fromJson($scope.products);
            };

            $scope.isExists = function () {
                var isExists = false;
                var selectedView = $scope.viewSorted;
                var productsData = $scope.products;
                var now = new Date();
                switch (selectedView) {
                    case "Today":
                        var today = now.getDay();
                        angular.forEach(productsData, function (prodData) {
                            var dbProdDateTime = prodData.datetime;
                            var prodDateTime = new Date(dbProdDateTime).getDay();
                            isExists = prodDateTime === today ? true : false;
                        });
                        return isExists;
                        break;
                    case "This Month":
                        var month = now.getMonth();
                        angular.forEach(productsData, function (prodData) {
                            var dbProdDateTime = prodData.datetime;
                            var prodDateTime = new Date(dbProdDateTime).getMonth();
                            isExists = prodDateTime === month ? true : false;
                        });
                        return isExists;
                        break;
                    case "This Year":
                        var year = now.getFullYear();
                        angular.forEach(productsData, function (prodData) {
                            var dbProdDateTime = prodData.datetime;
                            var prodDateTime = new Date(dbProdDateTime).getFullYear();
                            isExists = prodDateTime === year ? true : false;
                        });
                        return isExists;
                        break;
                    case "View All":
                        return $scope.products.length > 0 ? true : false;
                        break;
                    default :
                        return $scope.products.length > 0 ? true : false;
                        break;

                }
            };
            $scope.deleteProduct = function (product) {
                product.$delete().then(function () {
                    $scope.products.splice($scope.products.indexOf(product), 1);
                });
            };
            $scope.returnProd = function (productId, product) {
                var currId = productId;
                var prodData = $scope.products;
                for (var i = 0; i < prodData.length; i++) {
                    var id = prodData[i].id;
                    if (currId === id) {
                        prodData[i].products.splice(prodData[i].products.indexOf(product), 1);
                        $http({
                            url: sellingsUrl + currId,
                            method: "PUT",
                            data: {products: prodData[i].products}
                        }).then(function (products) {
                            //console.log(products);
                            var prodData = products.data;
                            if (!(prodData.products.length > 0)) {
                                $http.delete(sellingsUrl + prodData.id).then(function (response) {
                                    $scope.products.splice($scope.products.indexOf(products), 1);
                                    $scope.listProducts();
                                });
                            }
                        });
                    }
                }
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
            $scope.calculateTotal = function () {
                var productsData = $scope.products;
                var total = 0;
                for (var i = 0; i < productsData.length; i++) {
                    total += ((productsData[i].quantity * productsData[i].price) - productsData[i].discount);
                }
                return total;
            };
            $scope.calculateGrandTotal = function () {
                var total = 0;
                var grandTotal = 0;
                var now = new Date();
                var selectedView = $scope.viewSorted;
                var grandTotal = 0;
                var productsData = $scope.products;
                if (selectedView == "Today") {
                    var today = now.getDay();
                    angular.forEach(productsData, function (prodData) {
                        var dbProdDateTime = prodData.datetime;
                        var prodDateTime = new Date(dbProdDateTime).getDay();
                        if (prodDateTime === today) {
                            for (var i = 0; i < prodData.products.length; i++) {
                                total += ((prodData.products[i].price * prodData.products[i].quantity) - prodData.products[i].discount);
                            }
                        }
                    });
                    grandTotal += total;
                    return grandTotal;

                }
                else if (selectedView == "This Month") {
                    var month = now.getMonth();
                    angular.forEach(productsData, function (prodData) {
                        var dbProdDateTime = prodData.datetime;
                        var prodDateTime = new Date(dbProdDateTime).getMonth();
                        if (prodDateTime === month) {
                            for (var i = 0; i < prodData.products.length; i++) {
                                total += ((prodData.products[i].price * prodData.products[i].quantity) - prodData.products[i].discount);
                            }
                        }
                    });
                    grandTotal += total;
                    return grandTotal;

                }
                else if (selectedView == "This Year") {
                    var year = now.getFullYear();
                    angular.forEach(productsData, function (prodData) {
                        var dbProdDateTime = prodData.datetime;
                        var prodDateTime = new Date(dbProdDateTime).getFullYear();
                        if (prodDateTime === year) {
                            for (var i = 0; i < prodData.products.length; i++) {
                                total += ((prodData.products[i].price * prodData.products[i].quantity) - prodData.products[i].discount);
                            }
                        }
                    });
                    grandTotal += total;
                    return grandTotal;
                }
                else if (selectedView == "View All") {
                    //var month = now.getMonth();
                    angular.forEach(productsData, function (prodData) {
                        for (var i = 0; i < prodData.products.length; i++) {
                            total += ((prodData.products[i].price * prodData.products[i].quantity) - prodData.products[i].discount);
                        }
                    });
                    grandTotal += total;
                    return grandTotal;
                }
            };
            $scope.listProducts();
        })
        .directive("calculateTotal", function () {
            return {
                restrict: "E",
                transclude: true,
                replace: true,
                templateUrl: "ngViews/calculateTotalDir.html",
                scope: {
                    prodData: '=prodData'
                },
                controller: function ($scope) {
                    var prodData = $scope.prodData;
                    $scope.total = function () {
                        var total = 0;
                        for (i = 0; i < prodData.length; i++) {
                            total += ((prodData[i].price * prodData[i].quantity) - prodData[i].discount);
                        }
                        return total;
                    };
                }
            };
        })
        .filter("viewby", function () {
            return function (data, selectedView) {

                if (angular.isArray(data) && angular.isString(selectedView)) {
                    //console.log(selectedView);
                    var result = [];
                    var now = new Date();
                    switch (selectedView) {
                        case "Today":
                            var today = now.getDay();
                            var thisMonth = now.getMonth();
                            var thisYear = now.getFullYear();
                            angular.forEach(data, function (item) {
                                var dbDateTime = item.datetime;
                                var prodCurrDay = new Date(dbDateTime).getDay();
                                var prodCurrMonth = new Date(dbDateTime).getMonth();
                                var prodCurrYear = new Date(dbDateTime).getFullYear();
                                if (today === prodCurrDay && thisMonth === prodCurrMonth && thisYear === prodCurrYear) {
                                    result.push(item);
                                }
                            });
                            return result;
                            break;
                        case "This Month":
                            var thisMonth = now.getMonth();
                            var thisYear = now.getFullYear();
                            angular.forEach(data, function (item) {
                                var dbDateTime = item.datetime;
                                var prodCurrMonth = new Date(dbDateTime).getMonth();
                                var prodCurrYear = new Date(dbDateTime).getFullYear();
                                //console.log(prodCurrDateTime);
                                if (thisMonth === prodCurrMonth && thisYear === prodCurrYear) {
                                    result.push(item);
                                }
                            });
                            return result;
                            break;
                        case "This Year":
                            var thisYear = now.getFullYear();
                            angular.forEach(data, function (item) {
                                var dbDateTime = item.datetime;
                                var prodCurrYear = new Date(dbDateTime).getFullYear();
                                if (thisYear == prodCurrYear) {
                                    result.push(item);
                                }
                            });
                            return result;
                            break;
                        case "View All":
                            return data;
                            break;
                        default :
                            return data;
                            break;
                    }
                }
                else {
                    return data;
                }
                //switch (sele)
            }
        });