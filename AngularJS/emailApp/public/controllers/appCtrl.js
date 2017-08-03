angular.module("emailApp")
        .constant("sentUrl", "http://localhost:5500/sent/")
        .constant("emailsUrl", "http://localhost:5500/emailslisting/")
        .constant("settingsUrl", "http://localhost:5500/settings/")
        .controller("homeCtrl", function ($scope, $rootScope, $timeout, mailService) {
            $scope.searchEmail = [];
            $scope.reply = {};
            $scope.isContent = false;
            $scope.isReply = false;
            $scope.currentEmail = {};
            $scope.setSelected = function (email) {
                $scope.currentEmail = email;
                if (!$scope.isContent) {
                    $scope.isContent = true;
                }
            };
            $scope.isSelected = function (email) {
                if ($scope.currentEmail) {
                    return $scope.currentEmail === email;
                }
            };
            $scope.toggleReplyForm = function () {
                $scope.isReply = !$scope.isReply;
                $scope.reply = {};
                $scope.reply.to = $scope.currentEmail.from;
                $scope.reply.body = "\n\n=================\nReply of your following message\n=================\n" + $scope.currentEmail.body;
            };
            $scope.doReply = function (selectedEmail) {
                $scope.reply.to = $scope.currentEmail.from;
                $scope.toggleReplyForm();
            };
            $scope.sendReply = function () {
                $rootScope.isLoading = true;
                mailService.getMail().then(function (response) {
                    $scope.reply.datetime = $scope.currDateTime();
                    $scope.reply.from = response.data[0].email;
                    mailService.sendMail($scope.reply).then(function (result) {
                        $timeout(function () {
                            $scope.isReply = false;
                            $scope.reply = {};
                            $rootScope.isLoading = false;
                        }, 2000);
                    }, function (error) {
                        //Error reporting
                    });
                });
            };
            $scope.currDateTime = function () {
                return  datetime = new Date();
            };
            $scope.cancelReply = function () {
                $scope.reply = {};
                $scope.toggleReplyForm();
            };
            $scope.$watch("currentEmail", function () {
                $scope.isReply = false;
                $scope.reply = {};
            });
            $scope.currDateTime();
        })
        .controller("emailsListingCtrl", function ($scope, mailService) {
            $scope.nYearAgo = 0;
            $scope.populateEmails = function () {
                $scope.allEmails = {};
                mailService.getAllMail().then(function (response) {
                    $scope.allEmails = response.data;
                });
            };
            $scope.searchPastNYears = function (email) {
                var emailSendAtDate = new Date(email.datetime),
                        nYearAgoDate = new Date();
                nYearAgoDate.setFullYear(nYearAgoDate.getFullYear() - $scope.nYearAgo);
                return emailSendAtDate > nYearAgoDate;

            };
            $scope.populateEmails();
        })
        .controller("settingsCtrl", function ($scope, mailService) {
            $scope.setting = {};
            $scope.exists = false;
            $scope.listingSettings = function () {
                mailService.getMail().then(function (response) {
                    if (angular.isDefined(response.data[0])) {
                        $scope.setting = response.data[0];
                        $scope.exists = true;
                    } else {
                        $scope.exists = false;
                    }
                });
            };
            //remove setting
            $scope.delete = function (setting) {
                mailService.deleteMail(setting).then(function () {
                    $scope.setting = {};
                    $scope.exists = false;
                });
            };
            //create setting
            $scope.createSettings = function (setting) {
                mailService.createMail(setting).then(function () {
                    $scope.setting = setting;
                    $scope.exists = true;
                });
            };
            //update setting
            $scope.updateSettings = function (setting) {
                mailService.updateMail(setting).then(function () {
                    $scope.setting = setting;
                    $scope.exists = true;
                });
            };
            //cancel button
            $scope.cancelSettings = function () {
                $scope.setting = {};
                $scope.exists = false;
            };
            //create-edit button
            $scope.createOrEdit = function (settings) {
                if (angular.isDefined(settings.id)) {
                    $scope.updateSettings(settings);
                } else {
                    $scope.createSettings(settings);
                }
            }
            $scope.listingSettings();
        })
        .service("mailService", ["$http", "$q", "settingsUrl", "sentUrl", "emailsUrl", function ($http, $q, settingsUrl, sentUrl, emailsUrl) {
                var getMail = function () {
                    return $http.get(settingsUrl);
                };
                var getAllMail = function () {
                    return $http.get(emailsUrl);
                };
                var deleteMail = function (setting) {
                    return $http({
                        method: "DELETE",
                        url: settingsUrl + setting.id
                    });
                };
                var createMail = function (setting) {
                    return $http.post(settingsUrl, setting);
                };
                var updateMail = function (setting) {
                    return $http({
                        method: "PUT",
                        url: settingsUrl + setting.id,
                        data: setting
                    });
                };
                var sendMail = function (mail) {
                    var d = $q.defer();
                    $http({
                        method: "POST",
                        url: sentUrl,
                        data: mail
                    }).then(function (result) {
                        d.resolve(result);
                    }, function (error) {
                        d.reject(error);
                    });
                    return d.promise;
                };

                return {
                    getMail: getMail,
                    deleteMail: deleteMail,
                    createMail: createMail,
                    updateMail: updateMail,
                    sendMail: sendMail,
                    getAllMail: getAllMail

                };
            }]);

