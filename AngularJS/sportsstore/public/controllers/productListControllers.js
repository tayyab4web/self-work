angular.module("sportsStore")
        .constant("productListActiveClass", "btn-primary")
        .constant("productListPageCount", 3)
        .controller("productListCtrl", function ($scope, productListActiveClass, productListPageCount, cart) {
            var selectedCategory = null;
            $scope.selectedPage = 1;
            $scope.pageSize = productListPageCount;
            $scope.selectCategory = function (newCategory) {
                selectedCategory = newCategory;
                $scope.selectedPage = 1
            };
            $scope.selectPage = function (page) {
                return $scope.selectedPage = page;
            };
            $scope.categoryFilterFn = function (product) {
                return selectedCategory == null || product.category == selectedCategory;
            };
            $scope.getCategoryClass = function (category) {
                return selectedCategory == category ? productListActiveClass : "";
            };
            $scope.getPageClass = function (page) {
                return $scope.selectedPage == page ? productListActiveClass : "";
            };
            $scope.addProductToCart = function (product) {
                return cart.addProduct(product.id, product.name, product.price);
            };
        });