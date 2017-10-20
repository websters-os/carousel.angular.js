beforeEach(module('carousel'));

describe('contentCarousel component', function () {
    var $ctrl, items, $timeout, $rootScope;

    beforeEach(inject(function ($componentController, _$timeout_, _$rootScope_) {
        $timeout = _$timeout_;
        $rootScope = _$rootScope_;
        items = [1];
        $ctrl = $componentController('contentCarousel', null, {items: items});
        $ctrl.$onInit();
    }));

    it('first item is active', function () {
        expect($ctrl.classForIndex(0)).toEqual('active');
        expect($ctrl.isActive(0)).toBeTruthy();
    });

    it('not possible to go to another item', function () {
        $ctrl.goTo(1);
        expect($ctrl.classForIndex(0)).toEqual('active');
    });

    it('assert default animation duration', function () {
        expect($ctrl.duration).toEqual(800);
    });

    it('assert default auto-play speed', function () {
        expect($ctrl.autoPlaySpeed).toEqual(7000);
    });

    it('assert slide style', function () {
        expect($ctrl.slideStyle).toEqual({'animation-duration': '800ms'});
    });

    describe('with multiple items', function () {
        beforeEach(function () {
            items.push(2);
            items.push(3);
            $rootScope.$digest();
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

            it('assert active item', function () {
                expect($ctrl.isActive(1)).toBeTruthy();
            });

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

            describe('when new item is added', function () {
                beforeEach(function () {
                    items.push(4);
                    $rootScope.$digest();
                });

                it('reset active item', function () {
                    expect($ctrl.isActive(0)).toBeTruthy();
                });

                describe('and calling next after animation lock timeout', function () {
                    beforeEach(function () {
                        finishAnimation();
                        $ctrl.next();
                    });

                    assertGoToNext(0, 1);
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

        describe('when autoPlay is enabled', function () {
            beforeEach(function () {
                $ctrl.autoPlay = 'true';
                $ctrl.$onInit();
            });

            describe('after autoPlay speed duration, move to next', function () {
                beforeEach(function () {
                    afterAutoPlaySpeedDuration();
                });

                assertGoToNext(0, 1);

                describe('after some time before autoPlay speed duration is reached and after animation lock duration', function () {
                    beforeEach(function () {
                        $timeout.flush($ctrl.autoPlaySpeed/2);
                    });

                    describe('and manually trigger next', function () {
                        beforeEach(function () {
                            $ctrl.next();
                        });

                        assertGoToNext(1, 2);

                        describe('and just before autoPlay speed duration is reached, nothing changes', function () {
                            beforeEach(function () {
                                $timeout.flush($ctrl.autoPlaySpeed - 1);
                            });

                            assertGoToNext(1, 2);
                        });

                        describe('and when autoPlay speed duration is reached, go to next', function () {
                            beforeEach(function () {
                                $timeout.flush($ctrl.autoPlaySpeed);
                            });

                            assertGoToNext(2, 0);
                        });
                    });
                });

                describe('after autoPlay speed duration, move to next', function () {
                    beforeEach(function () {
                        afterAutoPlaySpeedDuration();
                    });

                    assertGoToNext(1, 2);

                    describe('after autoPlay speed duration, move to next', function () {
                        beforeEach(function () {
                            afterAutoPlaySpeedDuration();
                        });

                        assertGoToNext(2, 0);
                    });
                });

                describe('and autoPlay is disabled', function () {
                    beforeEach(function () {
                        $ctrl.autoPlay = 'false';
                        $ctrl.$onChanges();
                    });

                    describe('after autoPlay speed duration, do not move to next', function () {
                        beforeEach(function () {
                            afterAutoPlaySpeedDuration();
                        });

                        assertGoToNext(0, 1);
                    });
                });
            });
        });
    });

    function finishAnimation() {
        $timeout.flush($ctrl.duration - 250);
    }

    function afterAutoPlaySpeedDuration() {
        $timeout.flush($ctrl.autoPlaySpeed);
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