angular.module("carousel.templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("content-carousel.html","<div class=\"slides\" ng-class=\"::{\'slides-fade\': $ctrl.fade === \'true\'}\" ng-style=\"::$ctrl.slideStyle\" ng-swipe-left=\"$ctrl.next()\" ng-swipe-right=\"$ctrl.prev()\"><div class=\"slide\" ng-repeat=\"item in $ctrl.items\" ng-class=\"$ctrl.classForIndex($index)\" ng-include=\"::$ctrl.itemTemplateUrl\"></div><div class=\"controls\" ng-if=\"$ctrl.items.length > 1\"><div class=\"arrows\" ng-if=\"::$ctrl.arrows === \'true\'\"><button class=\"arrow-prev\" ng-click=\"$ctrl.prev()\"><i class=\"fa fa-chevron-left\"></i></button> <button class=\"arrow-next\" ng-click=\"$ctrl.next()\"><i class=\"fa fa-chevron-right\"></i></button></div><div class=\"dots-wrapper\" ng-if=\"::$ctrl.dots === \'true\'\"><div class=\"dots\"><ul><li ng-repeat=\"item in $ctrl.items\" ng-class=\"{active: $ctrl.isActive($index)}\"><button ng-click=\"$ctrl.goTo($index)\"></button></li></ul></div></div></div></div>");}]);