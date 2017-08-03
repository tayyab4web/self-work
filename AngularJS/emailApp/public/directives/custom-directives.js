angular.module("emailApp")
        .constant("imgUrl", "http://localhost:5500/images/loader5.gif")
        .directive("loader", function (imgUrl) {
            return {
                restrict: "E",
                link: function (scope, element, attrs) {
                    var img = angular.element("<img>").attr("src", imgUrl);
                    element.append(img);
                }
            }
        })
        .directive("emailListing", function () {
            return {
                restrict: "EA",
                link: function (scope, element, attrs) {
//                    var object = document.element("<div>").addClass("email-block");
//                    console.log(object);
                }
            };
        });
/*        
 
 
 <div class="email-block" ng-repeat="email in allEmails | filter:searchEmail" ng-click="setSelected(email)"  ng-class="{selected: isSelected(email)}">
 <div class="gravitor" >
 <img src="../images/gravitar.jpg" alt="">
 </div>
 <div class="text-block">
 <span class="subject">{{email.subject}}</span>
 <span class="from">{{email.from}}</span>
 </div>
 </div>
 
 
 
 */

        