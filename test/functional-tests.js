/* eslint-env jest */
import getSlider from '../src/simpleslider';
import {polyfill} from 'raf';

polyfill();

describe('SimpleSlider', function () {
  'use strict';

  var testDivCount = 0;

  // Helper functions to create dummy elements

  var createEmptyDiv = function () {
    var newDiv = document.createElement('div');
    newDiv.id = 'test-div-' + testDivCount;
    newDiv.style.width = '480px';
    newDiv.style.height = '200px';
    testDivCount++;

    return newDiv;
  };

  var addChildrenDivs = function (newDiv, numChild) {
    var childrenNum = numChild ? numChild : Math.ceil(Math.random() * 10);
    while (--childrenNum >= 0) {
      newDiv.appendChild(document.createElement('div'));
    }
  };

  var getNewDiv = function (numChild) {
    var newDiv = createEmptyDiv();
    addChildrenDivs(newDiv, numChild);
    return newDiv;
  };

  var getNewSlider = function (options, numChild) {
    var testDiv = getNewDiv(numChild);
    return getSlider(testDiv, options);
  };

  describe('slideshow animation logic', function () {
    it('should have correct default initial values', function () {
      var ss = getNewSlider({}, 5);
      expect(ss.internalState.getImgs()[0].style[ss.internalState.trProp]).toEqual(ss.internalState.visVal.toString() + ss.internalState.unit);
      expect(ss.internalState.getImgs()[1].style[ss.internalState.trProp]).toEqual(ss.internalState.startVal.toString() + ss.internalState.unit);
      ss.dispose();
    });

    it('should have correct custom initial values', function () {
      var ss = getNewSlider({
        transitionProperty: 'left',
        startValue: '-612px',
        visibleValue: '0px',
        endValue: '612px'
      }, 5);

      expect(ss.internalState.getImgs()[0].style[ss.internalState.trProp]).toEqual(ss.internalState.visVal.toString() + ss.internalState.unit);
      expect(ss.internalState.getImgs()[1].style[ss.internalState.trProp]).toEqual(ss.internalState.startVal.toString() + ss.internalState.unit);
      ss.dispose();
    });

    it('should change values correctly after default transition', function (done) {
      var ss = getNewSlider({}, 5);
      var nextIndex = ss.currentIndex() + 1;
      var timeEnoughToStartTransition = (ss.internalState.delay) + 100;
      var timeEnoughToEndTransition = (ss.internalState.trTime * 1000) + 100;

      expect.assertions(3);

      setTimeout(function () {
        // Internal index value is correct
        try {
          expect(ss.currentIndex()).toEqual(nextIndex);
        } catch (e) {
          console.error(e);
        }

        setTimeout(function () {
          // Test values after finishing the first transition
          try {
            expect(ss.internalState.getImgs()[0].style[ss.internalState.trProp]).toEqual(ss.internalState.endVal.toString() + ss.internalState.unit);
            expect(ss.internalState.getImgs()[1].style[ss.internalState.trProp]).toEqual(ss.internalState.visVal.toString() + ss.internalState.unit);
          } catch (e) {
            console.error(e);
          }
          ss.dispose();
          done();
        }, timeEnoughToEndTransition);
      }, timeEnoughToStartTransition);
    });

    it('should change values correctly, sliding style', function (done) {
      var ss = getNewSlider({
        transitionProperty: 'left',
        transitionDelay: 0.5,
        transitionDuration: 0.2,
        startValue: '-612px',
        visibleValue: '0px',
        endValue: '612px'
      }, 5);

      var nextIndex = ss.currentIndex() + 1;
      var timeEnoughToStartTransition = (ss.internalState.delay) + 100;
      var timeEnoughToEndTransition = (ss.internalState.trTime * 1000) + 100;

      expect.assertions(6);

      expect(ss.internalState.getImgs()[0].style[ss.internalState.trProp]).toEqual(ss.internalState.visVal.toString() + ss.internalState.unit);
      expect(ss.internalState.getImgs()[1].style[ss.internalState.trProp]).toEqual(ss.internalState.startVal.toString() + ss.internalState.unit);

      setTimeout(function () {
        // Internal index value is correct
        try {
          expect(ss.currentIndex()).toEqual(nextIndex);
        } catch (e) {
          console.error(e);
        }

        setTimeout(function () {
          // Test values after finishing the first transition
          try {
            expect(ss.internalState.getImgs()[0].style[ss.internalState.trProp]).toEqual(ss.internalState.endVal.toString() + ss.internalState.unit);
            expect(ss.internalState.getImgs()[1].style[ss.internalState.trProp]).toEqual(ss.internalState.visVal.toString() + ss.internalState.unit);
            expect(ss.internalState.getImgs()[2].style[ss.internalState.trProp]).toEqual(ss.internalState.startVal.toString() + ss.internalState.unit);
          } catch (e) {
            console.error(e);
          }
          ss.dispose();
          done();
        }, timeEnoughToEndTransition);
      }, timeEnoughToStartTransition);
    });

    it('should change values correctly after using change function', function (done) {
      var ss = getNewSlider({
        paused: true,
        transitionDelay: 0.5,
        transitionDuration: 0.2
      }, 5);

      var nextIndex = ss.currentIndex() + 1;
      var timeEnoughToStartTransition = (ss.internalState.delay) + 100;
      var timeEnoughToEndTransition = (ss.internalState.trTime * 1000) + 100;

      expect.assertions(3);

      ss.change(1);

      setTimeout(function () {
        // Internal index value is correct
        try {
          expect(ss.currentIndex()).toEqual(nextIndex);
        } catch (e) {
          console.error(e);
        }

        setTimeout(function () {
          // Test values after finishing the first transition
          try {
            expect(ss.internalState.getImgs()[0].style[ss.internalState.trProp]).toEqual(ss.internalState.endVal.toString() + ss.internalState.unit);
            expect(ss.internalState.getImgs()[1].style[ss.internalState.trProp]).toEqual(ss.internalState.visVal.toString() + ss.internalState.unit);
          } catch (e) {
            console.error(e);
          }
          ss.dispose();
          done();
        }, timeEnoughToEndTransition);
      }, timeEnoughToStartTransition);
    });

    it('should not change values when using paused:true option', function (done) {
      var ss = getNewSlider({
        paused: true,
        transitionDelay: 0.5,
        transitionDuration: 0.2
      }, 5);

      var startIndex = ss.currentIndex();
      var timeEnoughToStartTransition = (ss.internalState.delay) + 100;
      var timeEnoughToEndTransition = (ss.internalState.trTime * 1000) + 100;

      expect.assertions(3);

      setTimeout(function () {
        // Internal index value is correct
        try {
          expect(ss.currentIndex()).toEqual(startIndex);
        } catch (e) {
          console.error(e);
        }

        setTimeout(function () {
          // Ensure values paused hold initial values after time enough to have changed
          try {
            expect(ss.internalState.getImgs()[0].style[ss.internalState.trProp]).toEqual(ss.internalState.visVal.toString() + ss.internalState.unit);
            expect(ss.internalState.getImgs()[1].style[ss.internalState.trProp]).toEqual(ss.internalState.startVal.toString() + ss.internalState.unit);
          } catch (e) {
            console.error(e);
          }

          ss.dispose();

          done();
        }, timeEnoughToEndTransition);
      }, timeEnoughToStartTransition);
    });

    it('should work well with just 2 slides', function (done) {
      var ss;
      var changeCount = 0;
      var changeEndCount = 0;
      var startIndex;
      var nextIndex;
      var onChange = function () {
        if (changeCount === 0) {
          expect(ss.currentIndex()).toEqual(nextIndex);
        } else if (changeCount === 1) {
          // Internal index value should be start value again
          try {
            expect(ss.currentIndex()).toEqual(startIndex);
          } catch (e) {
            console.error(e);
          }
        } else {
          throw Error('Unexpected onChange invokation');
        }

        changeCount++;
      };

      var onChangeEnd = function () {
        if (changeEndCount === 0) {
          // Ensure values have changed
          try {
            expect(ss.internalState.getImgs()[0].style[ss.internalState.trProp]).toEqual(String(ss.internalState.endVal) + ss.internalState.unit);
            expect(ss.internalState.getImgs()[1].style[ss.internalState.trProp]).toEqual(String(ss.internalState.visVal) + ss.internalState.unit);
          } catch (e) {
            console.error(e);
          }
        } else if (changeEndCount === 1) {
          try {
            // Ensure values now hold initial values again
            expect(ss.internalState.getImgs()[0].style[ss.internalState.trProp]).toEqual(String(ss.internalState.visVal) + ss.internalState.unit);
            expect(ss.internalState.getImgs()[1].style[ss.internalState.trProp]).toEqual(String(ss.internalState.endVal) + ss.internalState.unit);
          } catch (e) {
            console.error(e);
          }

          ss.dispose();

          done();
        } else {
          throw Error('Unexpected onChangeEnd invokation');
        }

        changeEndCount++;
      };

      expect.assertions(8);

      ss = getNewSlider({
        transitionDelay: 0.5,
        transitionDuration: 0.2,
        onChange,
        onChangeEnd
      }, 2);
      startIndex = ss.currentIndex();
      nextIndex = ss.currentIndex() + 1;

      // Values should have correct initial values
      expect(ss.internalState.getImgs()[0].style[ss.internalState.trProp]).toEqual(String(ss.internalState.visVal) + ss.internalState.unit);
      expect(ss.internalState.getImgs()[1].style[ss.internalState.trProp]).toEqual(String(ss.internalState.startVal) + ss.internalState.unit);
    }, 15000);

    it('should not swap slides when there is only one image', function (done) {
      var ss = getNewSlider({
        transitionDelay: 0.5,
        transitionDuration: 0.2
      }, 1);

      var startIndex = ss.currentIndex();
      var timeEnoughToStartTransition = (ss.internalState.delay) + 100;
      var timeEnoughToEndTransition = (ss.internalState.trTime * 1000) + 100;

      expect.assertions(2);

      setTimeout(function () {
        // Internal index value is correct
        try {
          expect(ss.currentIndex()).toEqual(startIndex);
        } catch (e) {
          console.error(e);
        }

        setTimeout(function () {
          // Ensure values paused hold initial values after time enough to have changed
          try {
            expect(ss.internalState.getImgs()[0].style[ss.internalState.trProp]).toEqual(ss.internalState.visVal.toString() + ss.internalState.unit);
          } catch (e) {
            console.error(e);
          }

          ss.dispose();

          done();
        }, timeEnoughToEndTransition);
      }, timeEnoughToStartTransition);
    });

    it('should handle z-index during transition without remove anim', function (done) {
      var ss = getNewSlider({
        transitionProperty: 'width',
        startValue: '0px',
        visibleValue: '612px',
        endValue: '612px',
        transitionDelay: 0.5,
        transitionDuration: 0.2
      }, 5);

      // Simulates the state after a full carousel round
      var i = ss.internalState.getImgs().length;
      while (--i >= 0) {
        ss.internalState.getImgs()[i].style.zIndex = 1;
      }

      var timeEnoughToStartTransition = (ss.internalState.delay) + 100;

      expect.assertions(1);

      setTimeout(function testZIndex() {
        try {
          expect(
            parseInt(ss.internalState.getImgs()[0].style.zIndex)
          ).toBeGreaterThan(
            parseInt(ss.internalState.getImgs()[4].style.zIndex)
          );
        } catch (e) {
          console.error(e);
        }
        ss.dispose();
        done();
      }, timeEnoughToStartTransition);
    });

    it('should allow transition to lower values than visible value', function (done) {
      var ss = getNewSlider({
        transitionProperty: 'left',
        startValue: '612px',
        visibleValue: '0px',
        endValue: '-612px',
        transitionDelay: 0.5,
        transitionDuration: 0.5
      }, 5);

      var timeEnoughToHalftransition = ss.internalState.delay + ((ss.internalState.trTime / 2) * 1000);

      expect.assertions(4);

      setTimeout(function () {
        try {
          // Should be somewhere in the middle of animation values
          expect(parseInt(ss.internalState.getImgs()[0].style.left, 10)).toBeLessThan(0);
          expect(parseInt(ss.internalState.getImgs()[0].style.left, 10)).toBeGreaterThan(-612);
          expect(parseInt(ss.internalState.getImgs()[1].style.left, 10)).toBeLessThan(612);
          expect(parseInt(ss.internalState.getImgs()[1].style.left, 10)).toBeGreaterThan(0);
        } catch (e) {
          console.error(e);
        }

        ss.dispose();

        done();
      }, timeEnoughToHalftransition);
    });

    it('should allow opacity remove transition', function (done) {
      var ss = getNewSlider({
        transitionProperty: 'opacity',
        startValue: 0,
        visibleValue: 1,
        endValue: 0,
        transitionDelay: 0.5,
        transitionDuration: 0.5
      }, 5);

      var timeEnoughToHalftransition = ss.internalState.delay + ((ss.internalState.trTime / 2) * 1000);

      expect.assertions(2);

      setTimeout(function () {
        try {
          // Should be somewhere in the middle of remove animation
          expect(parseFloat(ss.internalState.getImgs()[0].style.opacity)).toBeLessThan(1);
          expect(parseFloat(ss.internalState.getImgs()[0].style.opacity)).toBeGreaterThan(0);
        } catch (e) {
          console.error(e);
        }

        ss.dispose();

        done();
      }, timeEnoughToHalftransition);
    });

    it('should be able to pause autoplay', function (done) {
      var ss = getNewSlider({
        paused: false,
        transitionDelay: 0.5,
        transitionDuration: 0.5
      }, 5);

      var timeEnoughToHalftransition = ((ss.internalState.delay + (ss.internalState.trTime / 2)));

      expect.assertions(1);

      setTimeout(function () {
        ss.pause();

        try {
          expect(ss.internalState.getRemainingTime()).toBeLessThan(timeEnoughToHalftransition);
        } catch (e) {
          console.error(e);
        }

        ss.dispose();

        done();
      }, timeEnoughToHalftransition);
    });
  });
});
