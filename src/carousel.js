angular.module('carousel', ['carousel.templates']).component('contentCarousel', {
    templateUrl: 'content-carousel.html',
    bindings: {
        items: '<',
        itemTemplateUrl: '@',
        duration: '@',
        arrows: '@',
        dots: '@',
        fade: '@'
    },
    controller: ['$timeout', function ($timeout) {
        var $ctrl = this;
        var activeIndex = 0;
        var classes = ['active'];
        var isAnimating;

        $ctrl.$onInit = function () {
            $ctrl.duration = $ctrl.duration || 800;
            $ctrl.slideStyle = {'animation-duration': $ctrl.duration + 'ms'};

            $ctrl.classForIndex = function (index) {
                return classes[index] || '';
            };

            $ctrl.next = function () {
                $ctrl.goTo(activeIndex + 1);
            };

            $ctrl.prev = function () {
                $ctrl.goTo(activeIndex - 1);
            };

            $ctrl.goTo = function (index) {
                if (isAnimating || $ctrl.items.length < 2) return;
                startAnimation();
                if (index > activeIndex) moveRightToLeft(index);
                else if (index < activeIndex) moveLeftToRight(index);
            };
        };

        function moveRightToLeft(index) {
            if (index > $ctrl.items.length - 1) index = 0;
            classes = [];
            classes[activeIndex] = 'to-left';
            classes[index] = 'active from-right';
            activeIndex = index;
        }

        function moveLeftToRight(index) {
            if (index < 0) index = $ctrl.items.length - 1;
            classes = [];
            classes[activeIndex] = 'to-right';
            classes[index] = 'active from-left';
            activeIndex = index;
        }

        function startAnimation() {
            isAnimating = true;
            $timeout(stopAnimation, getMinimumAnimationLockDuration());
        }

        function stopAnimation() {
            isAnimating = false;
        }

        function getMinimumAnimationLockDuration() {
            return $ctrl.duration > 250 ? $ctrl.duration - 250 : $ctrl.duration;
        }
    }]
});