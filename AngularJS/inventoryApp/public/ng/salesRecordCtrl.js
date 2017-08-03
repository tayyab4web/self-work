angular.module("inventoryAdmin")
        .constant("sellingsUrl", "http://localhost:8080/sellings/")
        .controller("salesRecordCtrl", function ($scope, $resource, sellingsUrl) {
            $scope.productsResource = $resource(sellingsUrl + ":id", {id: "@id"});
            $scope.listProducts = function () {
                $scope.products = $scope.productsResource.query();
                $scope.products = angular.fromJson($scope.products);
            };
            /*      datetimepicker functions
             * 
             * Bindable functions
             -----------------------------------------------*/
            $scope.endDateBeforeRender = endDateBeforeRender;
            $scope.endDateOnSetTime = endDateOnSetTime;
            $scope.startDateBeforeRender = startDateBeforeRender;
            $scope.startDateOnSetTime = startDateOnSetTime;

            function startDateOnSetTime() {
                $scope.$broadcast('start-date-changed');
            }

            function endDateOnSetTime() {
                $scope.$broadcast('end-date-changed');
            }

            function startDateBeforeRender($dates) {
                if ($scope.dateRangeEnd) {
                    var activeDate = moment($scope.dateRangeEnd);

                    $dates.filter(function (date) {
                        return date.localDateValue() >= activeDate.valueOf()
                    }).forEach(function (date) {
                        date.selectable = false;
                    })
                }
            }

            function endDateBeforeRender($view, $dates) {
                if ($scope.dateRangeStart) {
                    var activeDate = moment($scope.dateRangeStart).subtract(1, $view).add(1, 'minute');

                    $dates.filter(function (date) {
                        return date.localDateValue() <= activeDate.valueOf()
                    }).forEach(function (date) {
                        date.selectable = false;
                    });
                }
            }
            /*===========================================================*/
            var now = new Date();
            $scope.dateRangeStart = now;
            $scope.dateRangeEnd = now;
            $scope.setDateWithoutTime = function (datetime) {
                var d = new Date(datetime);
                d.setHours(0, 0, 0, 0);
                return d;
            };
            $scope.isExists = function () {
                var output = false;
                var rangeStartDate = $scope.setDateWithoutTime($scope.dateRangeStart);
                var rangeEndDate = $scope.setDateWithoutTime($scope.dateRangeEnd);
                var range = moment().range(rangeStartDate, rangeEndDate);
                var prodData = $scope.products;
                for (var i = 0; i < prodData.length; i++) {
                    var productsDate = $scope.setDateWithoutTime(prodData[i].datetime);
                    if (range.contains(productsDate)) {
                        output = prodData[i].products.length > 0 ? true : false;
                    }
                }
                return output;
            };
            $scope.getAllProductItems = function () {
                //setting dateRage
                var rangeStartDate = $scope.setDateWithoutTime($scope.dateRangeStart);
                var rangeEndDate = $scope.setDateWithoutTime($scope.dateRangeEnd);
                var range = moment().range(rangeStartDate, rangeEndDate);
                //setting global variables
                var productItems = [];
                var keys = {};
                var productsData = $scope.products;
                for (var i = 0; i < productsData.length; i++) {
                    var productsDate = $scope.setDateWithoutTime(productsData[i].datetime);
                    if (range.contains(productsDate)) {
//                        for (var i = 0; i < productsData.length; i++) {
                        for (j = 0; j < productsData[i].products.length; j++) {
                            var itemName = productsData[i].products[j].selectedValue;
                            if (angular.isUndefined(keys[itemName])) {
                                keys[itemName] = true;
                                productItems.push(itemName);
                            }
                        }
//                        }
//                        return productItems;
                    }
//                var rangeStart = new Date($scope.dateRangeStart);
//                var startDay = rangeStart.getDay();
//                var startMonth = rangeStart.getMonth();
//                var startYear = rangeStart.getFullYear();
//                var rangeEnd = new Date($scope.dateRangeEnd);
//                var endDay = rangeEnd.getDay();
//                var endMonth = rangeEnd.getMonth();
//                var endYear = rangeEnd.getFullYear();
                    //getting sold Products datetime 

                    //console.log(moment(rangeEnd).isAfter(rangeStart));

//                    var productsDateTime = new Date(prodData[i].datetime);
//                    console.log();

//                    prodDataDay = productsDateTime.getDay();
//                    prodDataMonth = productsDateTime.getMonth();
//                    prodDataYear = productsDateTime.getFullYear();
                    //comparing products datetime with DATE RANGE


//                    if (rangeStartDate >= productsDate && rangeEndDate <= productsDate) {
//                        console.log("start: " + rangeStartDate + " end: " + rangeEndDate);
//                    }


//                    console.log("before condition:");
//                    console.log("startDay is: " + startDay + " EndDay: " + endDay);
//                    if (
//                            (startDay >= prodDataDay && startMonth >= prodDataMonth && startYear >= prodDataYear)
//                            && (endDay <= prodDataDay && endMonth <= prodDataMonth && endYear <= prodDataYear)
//                            ) {
//                        console.log("after condition:");
//                        console.log("startDay is: " + startDay + " EndDay: " + endDay);
//                    }
                }
                return productItems;
            };
            $scope.countSold = function (itemsName) {
                //setting dateRage
                var rangeStartDate = $scope.setDateWithoutTime($scope.dateRangeStart);
                var rangeEndDate = $scope.setDateWithoutTime($scope.dateRangeEnd);
                var range = moment().range(rangeStartDate, rangeEndDate);
                //globals
                var prodData = $scope.products;
                var soldQty = 0;
                var CurrProdName = itemsName;
                for (var i = 0; i < prodData.length; i++) {
                    var productsDate = $scope.setDateWithoutTime(prodData[i].datetime);
                    if (range.contains(productsDate)) {
                        for (j = 0; j < prodData[i].products.length; j++) {
                            var prodName = prodData[i].products[j].selectedValue;
                            if (prodName == CurrProdName) {
                                soldQty += prodData[i].products[j].quantity;
                            }
                        }
                    }
                }
                return soldQty;
            };


            $scope.calcPrice = function (itemsName) {
                //setting dateRage
                var rangeStartDate = $scope.setDateWithoutTime($scope.dateRangeStart);
                var rangeEndDate = $scope.setDateWithoutTime($scope.dateRangeEnd);
                var range = moment().range(rangeStartDate, rangeEndDate);
                //globals
                var prodData = $scope.products;
                var totalPrice = 0;
                var CurrProdName = itemsName;
                for (var i = 0; i < prodData.length; i++) {
                    var productsDate = $scope.setDateWithoutTime(prodData[i].datetime);
                    if (range.contains(productsDate)) {
                        for (j = 0; j < prodData[i].products.length; j++) {
                            var prodName = prodData[i].products[j].selectedValue;
                            if (prodName == CurrProdName) {
                                totalPrice += (prodData[i].products[j].price * prodData[i].products[j].quantity);
                            }
                        }
                    }
                }
                return totalPrice;
            };

            $scope.calcDiscount = function (itemsName) {
                //setting dateRage
                var rangeStartDate = $scope.setDateWithoutTime($scope.dateRangeStart);
                var rangeEndDate = $scope.setDateWithoutTime($scope.dateRangeEnd);
                var range = moment().range(rangeStartDate, rangeEndDate);
                //globals
                var prodData = $scope.products;
                var totalDiscount = 0;
                var CurrProdName = itemsName;
                for (var i = 0; i < prodData.length; i++) {
                    var productsDate = $scope.setDateWithoutTime(prodData[i].datetime);
                    if (range.contains(productsDate)) {
                        for (j = 0; j < prodData[i].products.length; j++) {
                            var prodName = prodData[i].products[j].selectedValue;
                            if (prodName == CurrProdName) {
                                totalDiscount += prodData[i].products[j].discount;
                            }
                        }
                    }
                }
                return totalDiscount;
            };

            $scope.calcSubTotal = function (itemsName) {
                //setting dateRage
                var rangeStartDate = $scope.setDateWithoutTime($scope.dateRangeStart);
                var rangeEndDate = $scope.setDateWithoutTime($scope.dateRangeEnd);
                var range = moment().range(rangeStartDate, rangeEndDate);
                //globals
                var prodData = $scope.products;
                var subTotal = 0;
                var CurrProdName = itemsName;
                for (var i = 0; i < prodData.length; i++) {
                    var productsDate = $scope.setDateWithoutTime(prodData[i].datetime);
                    if (range.contains(productsDate)) {
                        for (j = 0; j < prodData[i].products.length; j++) {
                            var prodName = prodData[i].products[j].selectedValue;
                            var price = prodData[i].products[j].price;
                            var qty = prodData[i].products[j].quantity;
                            var discount = prodData[i].products[j].discount;
                            if (prodName == CurrProdName) {
                                subTotal += ((price * qty) - discount);
                            }
                        }
                    }
                }
                return subTotal;
            };



//if (moment(receivedDate).isAfter(startDate) && moment(receivedDate).isBefore(endDate)) {
//                retArray.push(obj);
//            }

//            if (item.completed_date > from_date && item.completed_date < to_date) {
//                filtered.push(item);
//            }



            $scope.calcGrandTotal = function () {
                //setting dateRage
                var rangeStartDate = $scope.setDateWithoutTime($scope.dateRangeStart);
                var rangeEndDate = $scope.setDateWithoutTime($scope.dateRangeEnd);
                var range = moment().range(rangeStartDate, rangeEndDate);
                //globals
                var grandTotal = 0;
                var prodData = $scope.products;
                for (var i = 0; i < prodData.length; i++) {
                    var productsDate = $scope.setDateWithoutTime(prodData[i].datetime);
                    if (range.contains(productsDate)) {
                        for (j = 0; j < prodData[i].products.length; j++) {
                            grandTotal += (prodData[i].products[j].price * prodData[i].products[j].quantity) - prodData[i].products[j].discount;
                        }
                    }
                }
                return grandTotal;
            };

            $scope.listProducts();

        })
//        .filter("dateRange", function () {
//            return function (data, products, startDate, endDate) {
//                var prodData = products;
//                var result = [];
//                if (angular.isArray(data) && angular.isArray(products) && angular.isDate(startDate) && angular.isDate(endDate)) {
//                    var rangeStart = new Date(startDate);
//                    var rangeEnd = new Date(endDate);
//                    angular.forEach(products, function (prodData) {
//                        var prodDatetime = new Date(prodData.datetime);
//                        
//                    });
//                }
//            };
//        });