/* eslint-env jasmine */
describe('simple-slider', function () {
  'use strict';

  var testDivCount = 0;

  // Helper functions to create dummy elements

  var createEmptyDiv = function () {
    var newDiv = document.createElement('div');
    newDiv.id = 'test-div-' + testDivCount;
    newDiv.style.width = '500px';
    newDiv.style.height = '500px';
    testDivCount++;

    return newDiv;
  };

  var addChildrenDivs = function (newDiv, numChild) {
    var childrenNum = numChild ? numChild : (Math.ceil(Math.random() * 10) + 1);
    var child;
    while (--childrenNum >= 0) {
      child = document.createElement('img');
      child.src = '//picsum.photos/50/50?random=' + (Math.random() * 1000);
      child.style.width = '100%';
      newDiv.appendChild(child);
    }
  };

  var getNewDiv = function (numChild) {
    var newDiv = createEmptyDiv();
    addChildrenDivs(newDiv, numChild);
    document.body.appendChild(newDiv);
    return newDiv;
  };

  var getNewSlider = function (options, numChild) {
    var container = getNewDiv(numChild);
    options.container = container;
    return {
      slider: window.simpleslider.getSlider(options),
      container: container
    };
  };

  describe('slideshow animation logic', function () {
    it('should have correct default initial values', function () {
      var s = getNewSlider({}, 5);
      expect(s.container.children[0].style.left).toEqual('0%');
      expect(s.container.children[1].style.left).toEqual('-100%');
      s.slider.dispose();
    });

    it('should have correct custom initial values', function () {
      var s = getNewSlider({
        prop: 'left',
        init: -500,
        show: 0,
        end: 500,
        unit: 'px'
      }, 5);

      expect(s.container.children[0].style.left).toEqual('0px');
      expect(s.container.children[1].style.left).toEqual('-500px');
      s.slider.dispose();
    });

    it('should change values correctly after default transition', function (done) {
      var startTime = 0;
      var isTransitionTested;
      var s = getNewSlider({}, 5);
      var nextIndex = s.slider.currentIndex() + 1;
      var timeEnoughToStartTransition = 3100;
      var timeEnoughToEndTransition = 3700;

      function testDefault(time) {
        if (!startTime) {
          startTime = time;
        }

        if ((time - startTime) > timeEnoughToEndTransition) {
          // Test values after finishing the first transition
          try {
            expect(s.container.children[0].style.left).toEqual('100%');
            expect(s.container.children[1].style.left).toEqual('0%');
          } catch (e) {
            console.error(e);
          }

          s.slider.dispose();
          done();
          return;
        }

        if (!isTransitionTested && (time - startTime) > timeEnoughToStartTransition) {
          // Internal index value is correct
          try {
            expect(s.slider.currentIndex()).toEqual(nextIndex);
          } catch (e) {
            console.error(e);
          }
        }

        requestAnimationFrame(testDefault);
      }

      requestAnimationFrame(testDefault);
    });

    it('should change values using no options', function (done) {
      // set a mock element with default data-attr
      var nextIndex;
      var s = {
        container: getNewDiv()
      };

      s.container.setAttribute('data-simple-slider', true);

      function onChange() {
        // Internal index value is correct
        try {
          expect(s.slider.currentIndex()).toEqual(nextIndex);
        } catch (e) {
          console.error(e);
        }
      }

      function onChangeEnd() {
        // Test values after finishing the first transition
        try {
          expect(s.container.children[0].style.left).toEqual('100%');
          expect(s.container.children[1].style.left).toEqual('0%');
        } catch (e) {
          console.error(e);
        }

        s.slider.dispose();
        done();
      }

      s.slider = window.simpleslider.getSlider({
        onChange: onChange,
        onChangeEnd: onChangeEnd
      });
      nextIndex = s.slider.currentIndex() + 1;
    });

    it('should change values correctly, sliding style', function (done) {
      var s = getNewSlider({
        prop: 'left',
        delay: 0.4,
        duration: 0.2,
        init: -500,
        show: 0,
        end: 500,
        unit: 'px'
      }, 5);

      var startTime = 0;
      var isTransitionTested;
      var nextIndex = s.slider.currentIndex() + 1;
      var timeEnoughToStartTransition = 500;
      var timeEnoughToEndTransition = 700;

      expect(s.container.children[0].style.left).toEqual('0px');
      expect(s.container.children[1].style.left).toEqual('-500px');

      function testSliding(time) {
        if (!startTime) {
          startTime = time;
        }

        if ((time - startTime) > timeEnoughToEndTransition) {
          // Test values after finishing the first transition
          try {
            expect(s.container.children[0].style.left).toEqual('500px');
            expect(s.container.children[1].style.left).toEqual('0px');
            expect(s.container.children[2].style.left).toEqual('-500px');
          } catch (e) {
            console.error(e);
          }

          s.slider.dispose();
          done();
          return;
        }

        if (!isTransitionTested && (time - startTime) > timeEnoughToStartTransition) {
          // Internal index value is correct
          try {
            expect(s.slider.currentIndex()).toEqual(nextIndex);
          } catch (e) {
            console.error(e);
          }

          isTransitionTested = true;
        }

        requestAnimationFrame(testSliding);
      }

      requestAnimationFrame(testSliding);
    });

    it('should change values correctly after using change function', function (done) {
      var s = getNewSlider({
        paused: true,
        delay: 0.4,
        duration: 0.2
      }, 5);

      var startTime = 0;
      var isTransitionTested;
      var nextIndex = s.slider.currentIndex() + 1;
      var timeEnoughToStartTransition = 500;
      var timeEnoughToEndTransition = 700;

      s.slider.change(1);

      function testChange(time) {
        if (!startTime) {
          startTime = time;
        }

        if ((time - startTime) > timeEnoughToEndTransition) {
          // Test values after finishing the first transition
          try {
            expect(s.container.children[0].style.left).toEqual('100%');
            expect(s.container.children[1].style.left).toEqual('0%');
          } catch (e) {
            console.error(e);
          }

          s.slider.dispose();
          done();
          return;
        }

        if (!isTransitionTested && (time - startTime) > timeEnoughToStartTransition) {
          // Internal index value is correct
          try {
            expect(s.slider.currentIndex()).toEqual(nextIndex);
          } catch (e) {
            console.error(e);
          }
        }

        requestAnimationFrame(testChange);
      }

      requestAnimationFrame(testChange);
    });

    it('should not change values when using paused:true option', function (done) {
      var s = getNewSlider({
        paused: true,
        delay: 0.4,
        duration: 0.2
      }, 5);

      var startTime = 0;
      var isTransitionTested;
      var startIndex = s.slider.currentIndex();
      var timeEnoughToStartTransition = 500;
      var timeEnoughToEndTransition = 700;

      function testPausedOption(time) {
        if (!startTime) {
          startTime = time;
        }

        if ((time - startTime) > timeEnoughToEndTransition) {
          try {
            expect(s.container.children[0].style.left).toEqual('0%');
            expect(s.container.children[1].style.left).toEqual('-100%');
          } catch (e) {
            console.error(e);
          }

          s.slider.dispose();

          done();
          return;
        }

        if (!isTransitionTested && (time - startTime) > timeEnoughToStartTransition) {
          // index value is correct
          try {
            expect(s.slider.currentIndex()).toEqual(startIndex);
          } catch (e) {
            console.error(e);
          }

          isTransitionTested = true;
        }

        requestAnimationFrame(testPausedOption);
      }

      requestAnimationFrame(testPausedOption);
    });

    it('should work well with just 2 slides', function (done) {
      var s;
      var changeCount = 0;
      var changeEndCount = 0;
      var startIndex;
      var nextIndex;
      var onChange = function () {
        if (changeCount === 0) {
          expect(s.slider.currentIndex()).toEqual(nextIndex);
        } else if (changeCount === 1) {
          // Internal index value should be start value again
          try {
            expect(s.slider.currentIndex()).toEqual(startIndex);
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
            expect(s.container.children[0].style.left).toEqual('100%');
            expect(s.container.children[1].style.left).toEqual('0%');
          } catch (e) {
            console.error(e);
          }
        } else if (changeEndCount === 1) {
          try {
            // Ensure values now hold initial values again
            expect(s.container.children[0].style.left).toEqual('0%');
            expect(s.container.children[1].style.left).toEqual('100%');
          } catch (e) {
            console.error(e);
          }

          s.slider.dispose();

          done();
        } else {
          throw Error('Unexpected onChangeEnd invokation');
        }

        changeEndCount++;
      };

      s = getNewSlider({
        delay: 0.2,
        duration: 0.1,
        onChange: onChange,
        onChangeEnd: onChangeEnd
      }, 2);
      startIndex = s.slider.currentIndex();
      nextIndex = s.slider.currentIndex() + 1;

      // Values should have correct initial values
      expect(s.container.children[0].style.left).toEqual('0%');
      expect(s.container.children[1].style.left).toEqual('-100%');
    });

    it('should not swap slides when there is only one image', function (done) {
      var s = getNewSlider({
        delay: 0.4,
        duration: 0.2
      }, 1);

      var startTime = 0;
      var isTransitionTested;
      var startIndex = s.slider.currentIndex();
      var timeEnoughToStartTransition = 500;
      var timeEnoughToEndTransition = 700;

      function testOneImage(time) {
        if (!startTime) {
          startTime = time;
        }

        if ((time - startTime) > timeEnoughToEndTransition) {
          // Ensure values paused hold initial values after time enough to have changed
          try {
            expect(s.container.children[0].style.left).toEqual('0%');
          } catch (e) {
            console.error(e);
          }

          s.slider.dispose();

          done();
          return;
        }

        if (!isTransitionTested && (time - startTime) > timeEnoughToStartTransition) {
          // Internal index value is correct
          try {
            expect(s.slider.currentIndex()).toEqual(startIndex);
          } catch (e) {
            console.error(e);
          }
        }

        requestAnimationFrame(testOneImage);
      }

      requestAnimationFrame(testOneImage);
    });

    it('should handle z-index during transition', function (done) {
      var s = getNewSlider({
        prop: 'width',
        init: 0,
        show: 500,
        end: 500,
        unit: 'px',
        delay: 0.2,
        duration: 0.1
      }, 5);

      // Simulates the state after a full carousel round
      var i = s.container.children.length;
      while (--i >= 0) {
        s.container.children[i].style.zIndex = 1;
      }

      var startTime = 0;
      var timeEnoughToStartTransition = 320;

      function testZIndex(time) {
        if (!startTime) {
          startTime = time;
        }

        if ((time - startTime) > timeEnoughToStartTransition) {
          try {
            expect(
              parseInt(s.container.children[1].style.zIndex)
            ).toBeGreaterThan(
              parseInt(s.container.children[0].style.zIndex)
            );
            expect(
              parseInt(s.container.children[0].style.zIndex)
            ).toBeGreaterThan(
              parseInt(s.container.children[4].style.zIndex)
            );
          } catch (e) {
            console.error(e);
          }

          s.slider.dispose();
          done();
          return;
        }

        requestAnimationFrame(testZIndex);
      }

      requestAnimationFrame(testZIndex);
    });

    it('should allow transition to lower values than visible value', function (done) {
      var s = getNewSlider({
        prop: 'left',
        init: 500,
        show: 0,
        end: -500,
        unit: 'px',
        delay: 0.5,
        duration: 0.4
      }, 5);

      var startTime = 0;
      var timeEnoughToHalftransition = 700;

      function testVisible(time) {
        if (!startTime) {
          startTime = time;
        }

        if ((time - startTime) > timeEnoughToHalftransition) {
          try {
            // Should be somewhere in the middle of animation values
            expect(parseInt(s.container.children[0].style.left, 10)).toBeLessThan(0);
            expect(parseInt(s.container.children[0].style.left, 10)).toBeGreaterThan(-500);
            expect(parseInt(s.container.children[1].style.left, 10)).toBeLessThan(500);
            expect(parseInt(s.container.children[1].style.left, 10)).toBeGreaterThan(0);
          } catch (e) {
            console.error(e);
          }

          s.slider.dispose();

          done();
          return;
        }

        requestAnimationFrame(testVisible);
      }

      requestAnimationFrame(testVisible);
    });

    it('should allow opacity remove transition', function (done) {
      var s = getNewSlider({
        prop: 'opacity',
        init: 0,
        show: 1,
        end: 0,
        unit: '',
        delay: 0.5,
        duration: 0.4
      }, 5);

      var startTime = 0;
      var timeEnoughToHalftransition = 700;

      function testOpacity(time) {
        if (!startTime) {
          startTime = time;
        }

        if ((time - startTime) > timeEnoughToHalftransition) {
          try {
            // Should be somewhere in the middle of remove animation
            expect(parseFloat(s.container.children[0].style.opacity)).toBeLessThan(1);
            expect(parseFloat(s.container.children[0].style.opacity)).toBeGreaterThan(0);
          } catch (e) {
            console.error(e);
          }

          s.slider.dispose();

          done();
          return;
        }

        requestAnimationFrame(testOpacity);
      }

      requestAnimationFrame(testOpacity);
    });

    it('should be able to pause autoplay', function (done) {
      var s = getNewSlider({
        paused: false,
        delay: 0.5,
        duration: 0.4
      }, 5);

      var isTransitionTested;
      var timeEnoughToHalftransition = 750;
      var timeEnoughToAnotherTransition = 980;
      var startTime = 0;

      expect(s.container.children[0].style.left).toEqual('0%');
      expect(s.container.children[1].style.left).toEqual('-100%');

      function testPause(time) {
        if (!startTime) {
          startTime = time;
        } else if ((time - startTime) > timeEnoughToAnotherTransition) {
          // after a long enough delay, left position of slide should stay the same
          try {
            expect(s.container.children[0].style.left).toEqual('100%');
            expect(s.container.children[1].style.left).toEqual('0%');
          } catch (e) {
            console.error(e);
          }

          s.slider.dispose();

          done();
          return;
        } else if (!isTransitionTested && (time - startTime) > timeEnoughToHalftransition) {
          s.slider.pause();

          try {
            expect(parseInt(s.container.children[0].style.left, 10)).toBeLessThan(100);
            expect(parseInt(s.container.children[0].style.left, 10)).toBeGreaterThan(0);
            expect(parseInt(s.container.children[1].style.left, 10)).toBeLessThan(0);
            expect(parseInt(s.container.children[1].style.left, 10)).toBeGreaterThan(-100);
          } catch (e) {
            console.error(e);
          }

          isTransitionTested = true;
        }

        requestAnimationFrame(testPause);
      }

      requestAnimationFrame(testPause);
    });
  });
});
