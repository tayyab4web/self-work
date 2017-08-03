angular.module("cart", [])
        .factory("cart", function () {
            var cartData = [];
            return {
                addProduct: function (id, name, price) {
                    var addExistingProduct = false;
                    for (var i = 0; i < cartData.length; i++) {
                        if (cartData[i].id == id) {
                            cartData[i].count++;
                            addExistingProduct = true;
                            break;
                        }
                    }
                    if (!addExistingProduct) {
                        cartData.push({count: 1, id: id, name: name, price: price});
                    }
                },
                removeProduct: function (id) {
                    for (var i = 0; i < cartData.length; i++) {
                        if (cartData[i].id == id) {
                            cartData.splice(i, 1);
                            break;
                        }
                    }
                },
                getProducts: function () {
                    return cartData;
                }
            }
        })
        .directive("cartSummary", function (cart) {
            return {
                restrict: "E",
                templateUrl: "components/cart/cartSummary.html",
                controller: function ($scope) {
                    var cartData = cart.getProducts();
                    $scope.total = function () {
                        var total = 0;
                        for (i = 0; i < cartData.length; i++) {
                            total += (cartData[i].price * cartData[i].count);
                        }
                        return total;
                    };
                    $scope.itemCount = function () {
                        var totalItem = 0;
                        for (var i = 0; i < cartData.length; i++) {
                            totalItem += cartData[i].count;
                        }
                        return totalItem;
                    }
                }
            };
        });