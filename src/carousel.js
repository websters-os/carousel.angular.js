angular.module('carousel', ['carousel.templates']).component('contentCarousel', {
    templateUrl: 'content-carousel.html',
    bindings: {
        items: '<',
        itemTemplateUrl: '@',
        duration: '@',
        arrows: '@',
        dots: '@',
        fade: '@',
        autoPlay: '@',
        autoPlaySpeed: '@'
    },
    controller: ['$timeout', function ($timeout) {
        var $ctrl = this;
        var activeIndex = 0;
        var classes = ['active'];
        var isAnimating;
        var autoPlayTimeout;
        var isInitialised;

        $ctrl.$onInit = function () {
            isInitialised = true;
            $ctrl.duration = $ctrl.duration || 800;
            $ctrl.slideStyle = {'animation-duration': $ctrl.duration + 'ms'};
            $ctrl.autoPlaySpeed = $ctrl.autoPlaySpeed || 7000;
            autoPlayIfEnabled();

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
                resetAutoPlayTimeout();
                if (index > activeIndex) moveRightToLeft(index);
                else if (index < activeIndex) moveLeftToRight(index);
            };
        };

        $ctrl.$onChanges = function () {
            if (isInitialised) autoPlayIfEnabled();
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

        function autoPlay() {
            autoPlayTimeout = $timeout(function () {
                $ctrl.next();
                autoPlay();
            }, $ctrl.autoPlaySpeed);
        }

        function stopAutoPlay() {
            if (autoPlayTimeout) $timeout.cancel(autoPlayTimeout);
        }

        function autoPlayIfEnabled() {
            $ctrl.autoPlay === 'true' ? autoPlay() : stopAutoPlay();
        }

        function resetAutoPlayTimeout() {
            if (autoPlayTimeout && $timeout.cancel(autoPlayTimeout)) autoPlay();
        }
    }]
});