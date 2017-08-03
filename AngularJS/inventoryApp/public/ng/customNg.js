var inventoryApp = angular.module("inventoryApp", ["ngRoute", "ngResource"]);
inventoryApp.config(function ($routeProvider) {
    $routeProvider
            .when("/", {
                templateUrl: "ngViews/main.html"
            })
            .when("/listingSales", {
                templateUrl: "ngViews/listingSales.html"
            })
            .otherwise({
                templateUrl: "ngViews/main.html"
            });
});
inventoryApp.constant("productsUrl", "http://localhost:8080/current-products/")
        .constant("sellingsUrl", "http://localhost:8080/sellings/")
        .controller("inventoryAppCtrl", function ($scope, $element, $http, $window, sellingsUrl, productsUrl) {
            $http.get(productsUrl).then(function (response) {
                $scope.currentProducts = response.data;
                $scope.firstProduct = $scope.currentProducts[0].productName;
                var count = 1;
                $scope.products = [
                    {count: count, selectedValue: $scope.firstProduct, quantity: 1, discount: 0}
                ];
                $scope.addNewRow = function (event) {
                    if (event.keyCode === 13) {
                        count++;
                        $scope.products.push({count: count, selectedValue: $scope.firstProduct, quantity: 1, discount: 0});
                    }
                };
                var currentDateTime = function () {
                    return now = new Date();
                };
                $scope.calculateTotal = function (prodData) {
                    var productsData = $scope.products;
                    var total = 0;
                    for (var i = 0; i < productsData.length; i++) {
                        total += ((productsData[i].quantity * productsData[i].price) - productsData[i].discount);
                    }
                    return total;
                };
                $scope.isNotANum = function () {
                    return isNaN($scope.calculateTotal());
                };
                $scope.formateDateTime = function (datetime) {
                    var prodDateTime = new Date(datetime);
                    return prodDateTime.getDate() + " /" + (prodDateTime.getMonth() + 1) + " / " + prodDateTime.getFullYear();
                };
                $scope.generatePrint = function (prodData) {
                    var productsData = prodData;
                    var html = "<table border='0' cellpadding='0' cellspacing='0' align='center' style='font-size:10px;margin:0 auto;' class='table'>";
                    html += "<tr>";
                    html += "<td colspan='2'>";
                    html += "<p style='font-size:18px;text-align:center;'>طہٰ گارمنٹس</p>";
                    html += "</td>";
                    html += "</tr>";
                    html += "<tr>";
                    html += "<td>";
                    html += "No. " + productsData.id;
                    html += "</td>";
                    html += "<td>";
                    html += $scope.formateDateTime(productsData.datetime);
                    html += "</td>";
                    html += "</tr>";
                    html += "<tr>";
                    html += "<td colspan='2'>";
                    html += "<table style='font-size:12px;'>";
                    html += "<tr>";
                    html += "<td colspan='6'><hr style='padding:0;margin:0;'></td>";
                    html += "</tr>";
                    html += "<tr>";
                    html += "<td style='padding-right:8px;text-align:center;'>#</td>";
                    html += "<td style='padding-right:8px;text-align:center;'>Name</td>";
                    html += "<td style='padding-right:8px;text-align:center;'>Price</td>";
                    html += "<td  style='padding-right:8px;text-align:center;'>Qty</td>";
                    html += "<td  style='padding-right:8px;text-align:center;'>Disc</td>";
                    html += "<td  style='padding-right:8px;text-align:center;'>Sub Total</td>";
                    html += "</tr>";
                    html += "<tr>";
                    html += "<td  colspan='6'><hr style='padding:0;margin:0;'></td>";
                    html += "</tr>";
                    for (var i = 0; i < productsData.products.length; i++) {
                        html += "<tr>";
                        html += "<td style='padding-right:8px;text-align:center;'>";
                        html += productsData.products[i].count;
                        html += "</td>";
                        html += "<td style='padding-right:8px;text-align:center;'>";
                        html += productsData.products[i].selectedValue;
                        html += "</td>";
                        html += "<td  style='padding-right:8px;text-align:center;'>";
                        html += productsData.products[i].price;
                        html += "</td>";
                        html += "<td  style='padding-right:8px;text-align:center;'>";
                        html += productsData.products[i].quantity;
                        html += "</td>";
                        html += "<td  style='padding-right:8px;text-align:center;'>";
                        html += productsData.products[i].discount;
                        html += "</td>";
                        html += "<td  style='padding-right:8px;text-align:center;'>";
                        html += ((productsData.products[i].price * productsData.products[i].quantity) - productsData.products[i].discount);
                        html += "</td>";
                        html += "</tr>";
                    }
                    html += "<tr>";
                    html += "<td colspan='6'><hr style='padding:0;margin:0;'></td>";
                    html += "</tr>";
                    html += "<tr>";
                    html += "<td  style='padding-right:8px;text-align:center;'>";
                    html += "Total: ";
                    html += "</td>";
                    html += "<td colspan='4'>&nbsp;</td>";
                    html += "<td  style='padding-right:8px;text-align:center;'>";
                    html += $scope.calTotal();
                    html += "</td>";
                    html += "</tr>";
                    html += "</table>";
                    html += "</td>";
                    html += "</tr>";
                    html += "</table>";
                    return html;

                };
                $scope.printDiv = function (html) {
                    //var printContents = document.getElementById(divId).innerHTML;
                    var popupWin = window.open('', '_blank', 'width=300,height=300');
                    popupWin.document.open();
                    popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + html + '</body></html>');
                    popupWin.document.close();
                };
                $scope.submitForm = function (products) {
                    var datetime = currentDateTime();
                    $http.post(sellingsUrl, {datetime: datetime, products: products})
                            .then(
                                    function (res) {
                                        $scope.prodData = res.data;
                                        $scope.calTotal = function () {
                                            var pData = $scope.prodData.products;
                                            var total = 0;
                                            //console.log(pData.products.length);
                                            for (var i = 0; i < pData.length; i++) {
                                                total += ((pData[i].quantity * pData[i].price) - pData[i].discount);
                                            }
                                            return total;
                                        };
                                        var printContent = $scope.generatePrint($scope.prodData);
                                        $scope.printDiv(printContent);
                                        $scope.products = [
                                            {count: 1, selectedValue: $scope.firstProduct, quantity: 1, discount: 0}
                                        ];
                                    }, function (e) {
                                console.log(e)
                            }
                            );
                };
            }, function (error) {
                //error handle
            });
        });
