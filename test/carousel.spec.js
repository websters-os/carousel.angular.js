beforeEach(module('carousel'));

describe('contentCarousel component', function () {
    var $ctrl, items, $timeout;

    beforeEach(inject(function ($componentController, _$timeout_) {
        $timeout = _$timeout_;
        items = [1];
        $ctrl = $componentController('contentCarousel', null, {items: items});
        $ctrl.$onInit();
    }));

    it('first item is active', function () {
        expect($ctrl.classForIndex(0)).toEqual('active');
    });

    it('not possible to go to another item', function () {
        $ctrl.goTo(1);
        expect($ctrl.classForIndex(0)).toEqual('active');
    });

    it('assert default animation duration', function () {
        expect($ctrl.duration).toEqual(800);
    });

    it('assert slide style', function () {
        expect($ctrl.slideStyle).toEqual({'animation-duration': '800ms'});
    });

    describe('with multiple items', function () {
        beforeEach(function () {
            items.push(2);
            items.push(3);
        });

        it('first item is active', function () {
            expect($ctrl.classForIndex(0)).toEqual('active');
            expect($ctrl.classForIndex(1)).toEqual('');
            expect($ctrl.classForIndex(2)).toEqual('');
        });

        it('when asking for class of unknown index', function () {
            expect($ctrl.classForIndex(100)).toEqual('');
        });

        describe('go to next', function () {
            beforeEach(function () {
                $ctrl.next();
            });

            assertGoToNext(0, 1);

            describe('and calling next before animation time-frame is finished, does nothing', function () {
                beforeEach(function () {
                    $ctrl.next();
                });

                assertGoToNext(0, 1);
            });

            describe('and calling next after animation lock timeout', function () {
                beforeEach(function () {
                    finishAnimation();
                    $ctrl.next();
                });

                assertGoToNext(1, 2);

                describe('and next, return to first', function () {
                    beforeEach(function () {
                        finishAnimation();
                        $ctrl.next();
                    });

                    assertGoToNext(2, 0);
                });
            });
        });

        describe('go to prev, this is the last item', function () {
            beforeEach(function () {
                $ctrl.prev();
            });

            assertGoToPrev(0, 2);

            describe('and prev', function () {
                beforeEach(function () {
                    finishAnimation();
                    $ctrl.prev();
                });

                assertGoToPrev(2, 1);

                describe('and prev', function () {
                    beforeEach(function () {
                        finishAnimation();
                        $ctrl.prev();
                    });

                    assertGoToPrev(1, 0);
                });
            });
        });

        describe('go to item with higher index', function () {
            beforeEach(function () {
                $ctrl.goTo(2);
            });

            assertGoToNext(0, 2);

            describe('go to item with lower index', function () {
                beforeEach(function () {
                    finishAnimation();
                    $ctrl.goTo(0);
                });

                assertGoToPrev(2, 0);
            });
        });
    });

    function finishAnimation() {
        $timeout.flush($ctrl.duration - 250);
    }

    function assertGoToNext(index, nextIndex) {
        it('active item is moved to the left', function () {
            expect($ctrl.classForIndex(index)).toEqual('to-left');
        });

        it('next item is active and moved in from the right', function () {
            expect($ctrl.classForIndex(nextIndex)).toEqual('active from-right');
        });
    }

    function assertGoToPrev(index, nextIndex) {
        it('active item is moved to the right', function () {
            expect($ctrl.classForIndex(index)).toEqual('to-right');
        });

        it('previous item is active and moved in from the left', function () {
            expect($ctrl.classForIndex(nextIndex)).toEqual('active from-left');
        });
    }
});