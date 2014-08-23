describe('SimpleSlider', function() {

  'use strict';

  var testDivCount = 0;
  var _consoleWarn;

  // Helper functions to create dummy elements

  var createEmptyDiv = function() {

    var newDiv = document.createElement('div');
    newDiv.id = 'test-div-' + testDivCount;
    newDiv.style.width = '480px';
    newDiv.style.height = '200px';
    testDivCount++;

    return newDiv;

  };

  var getNewDiv = function(numChild) {

    var newDiv = createEmptyDiv();

    addChildrenDivs(newDiv, numChild);

    return newDiv;

  };

  var addChildrenDivs = function(newDiv, numChild) {

    var childrenNum = numChild ? numChild : Math.ceil( Math.random()*10 );
    while (--childrenNum >= 0) {
      newDiv.appendChild(document.createElement('div'));
    }

  };

  var getNewSlider = function(options, numChild) {

    var testDiv = getNewDiv(numChild);
    var ss = new SimpleSlider(testDiv, options);

    return ss;

  };

  var createEmptySlider = function() {

    _consoleWarn = console.warn;
    console.warn = function() {};

    return new SimpleSlider(createEmptyDiv());

  };

  var disposeEmptySlider = function(ss) {
    ss.dispose();
    console.warn = _consoleWarn;
  };

  describe('slideshow animation logic', function() {

    it('should have correct default initial values', function() {

      var ss = getNewSlider({}, 5);

      expect(ss.imgs[0].style[ss.trProp]).toEqual(ss.visVal.toString() + ss.unit);
      expect(ss.imgs[1].style[ss.trProp]).toEqual(ss.startVal.toString() + ss.unit);

      ss.dispose();

    });

    it('should have correct custom initial values', function() {

      var ss = getNewSlider({
        autoPlay:true,
        transitionProperty:'left',
        startValue:'-612px',
        visibleValue:'0px',
        endValue:'612px'
      }, 5);

      expect(ss.imgs[0].style[ss.trProp]).toEqual(ss.visVal.toString() + ss.unit);
      expect(ss.imgs[1].style[ss.trProp]).toEqual(ss.startVal.toString() + ss.unit);

      ss.dispose();

    });

    it('should change values correctly after default transition', function(done) {

      var ss = getNewSlider({}, 5);

      var nextIndex = ss.actualIndex+1;
      var timeEnoughToStartTransition = (ss.delay) + 100;
      var timeEnoughToEndTransition = ss.trTime * 1000 + 100;

      setTimeout(function() {

        // Internal index value is correct
        expect(ss.actualIndex).toEqual(nextIndex);

        setTimeout(function() {

          // Test values after finishing the first transition
          expect(ss.imgs[0].style[ss.trProp]).toEqual(ss.endVal.toString() + ss.unit);
          expect(ss.imgs[1].style[ss.trProp]).toEqual(ss.visVal.toString() + ss.unit);

          ss.dispose();

          done();

        }, timeEnoughToEndTransition);
      }, timeEnoughToStartTransition);

    });

    it('should change values correctly, sliding style', function(done) {

      var ss = getNewSlider({
        autoPlay:true,
        transitionProperty:'left',
        transitionDelay: 0.5,
        transitionDuration: 0.2,
        startValue:'-612px',
        visibleValue:'0px',
        endValue:'612px'
      }, 5);

      var nextIndex = ss.actualIndex+1;
      var timeEnoughToStartTransition = (ss.delay) + 100;
      var timeEnoughToEndTransition = ss.trTime * 1000 + 100;

      expect(ss.imgs[0].style[ss.trProp]).toEqual(ss.visVal.toString() + ss.unit);
      expect(ss.imgs[1].style[ss.trProp]).toEqual(ss.startVal.toString() + ss.unit);

      setTimeout(function() {

        // Internal index value is correct
        expect(ss.actualIndex).toEqual(nextIndex);

        setTimeout(function() {

          // Test values after finishing the first transition
          expect(ss.imgs[0].style[ss.trProp]).toEqual(ss.endVal.toString() + ss.unit);
          expect(ss.imgs[1].style[ss.trProp]).toEqual(ss.visVal.toString() + ss.unit);
          expect(ss.imgs[2].style[ss.trProp]).toEqual(ss.startVal.toString() + ss.unit);

          ss.dispose();

          done();

        }, timeEnoughToEndTransition);
      }, timeEnoughToStartTransition);

    });

    it('should change values correctly after using change function', function(done) {

      var ss = getNewSlider({
        autoPlay: false,
        transitionDelay: 0.5,
        transitionDuration: 0.2
      }, 5);

      var nextIndex = ss.actualIndex+1;
      var timeEnoughToStartTransition = (ss.delay) + 100;
      var timeEnoughToEndTransition = ss.trTime * 1000 + 100;

      ss.change(1);

      setTimeout(function() {

        // Internal index value is correct
        expect(ss.actualIndex).toEqual(nextIndex);

        setTimeout(function() {

          // Test values after finishing the first transition
          expect(ss.imgs[0].style[ss.trProp]).toEqual(ss.endVal.toString() + ss.unit);
          expect(ss.imgs[1].style[ss.trProp]).toEqual(ss.visVal.toString() + ss.unit);

          ss.dispose();

          done();

        }, timeEnoughToEndTransition);
      }, timeEnoughToStartTransition);

    });

    it('should not change values when using autoPlay:false option', function(done) {

      var ss = getNewSlider({
        autoPlay: false,
        transitionDelay: 0.5,
        transitionDuration: 0.2
      }, 5);

      var startIndex = ss.actualIndex;
      var timeEnoughToStartTransition = (ss.delay) + 100;
      var timeEnoughToEndTransition = ss.trTime * 1000 + 100;

      setTimeout(function() {

        // Internal index value is correct
        expect(ss.actualIndex).toEqual(startIndex);

        setTimeout(function() {

          // Ensure values still hold initial values after time enough to have changed
          expect(ss.imgs[0].style[ss.trProp]).toEqual(ss.visVal.toString() + ss.unit);
          expect(ss.imgs[1].style[ss.trProp]).toEqual(ss.startVal.toString() + ss.unit);

          ss.dispose();

          done();

        }, timeEnoughToEndTransition);
      }, timeEnoughToStartTransition);

    });

    it('should work well with just 2 slides', function(done) {

      var ss = getNewSlider({
        autoPlay: true,
        transitionDelay: 0.5,
        transitionDuration: 0.2
      }, 2);

      var startIndex = ss.actualIndex;
      var nextIndex = ss.actualIndex + 1;
      var timeEnoughToStartTransition = (ss.delay) + 10;
      var timeEnoughToEndTransition = ss.trTime * 1000 + 10;

      // Values should have correct initial values
      expect(ss.imgs[0].style[ss.trProp]).toEqual(ss.visVal.toString() + ss.unit);
      expect(ss.imgs[1].style[ss.trProp]).toEqual(ss.startVal.toString() + ss.unit);

      setTimeout(function() {

        // Internal index value is correct
        expect(ss.actualIndex).toEqual(nextIndex);

        setTimeout(function() {

          // Ensure values have changed
          expect(ss.imgs[0].style[ss.trProp]).toEqual(ss.endVal.toString() + ss.unit);
          expect(ss.imgs[1].style[ss.trProp]).toEqual(ss.visVal.toString() + ss.unit);

          setTimeout(function() {

            // Internal index value should be start value again
            expect(ss.actualIndex).toEqual(startIndex);

            setTimeout(function() {

              // Ensure values now hold initial values after time enough to have changed
              expect(ss.imgs[0].style[ss.trProp]).toEqual(ss.visVal.toString() + ss.unit);
              expect(ss.imgs[1].style[ss.trProp]).toEqual(ss.endVal.toString() + ss.unit);

              ss.dispose();

              done();

            }, timeEnoughToEndTransition);
          }, timeEnoughToStartTransition);

        }, timeEnoughToEndTransition);
      }, timeEnoughToStartTransition);

    });

    it('should not swap slides when there is only one image', function(done) {

      var ss = getNewSlider({
        autoPlay: true,
        transitionDelay: 0.5,
        transitionDuration: 0.2
      }, 1);

      var startIndex = ss.actualIndex;
      var timeEnoughToStartTransition = (ss.delay) + 100;
      var timeEnoughToEndTransition = ss.trTime * 1000 + 100;

      setTimeout(function() {

        // Internal index value is correct
        expect(ss.actualIndex).toEqual(startIndex);

        setTimeout(function() {

          // Ensure values still hold initial values after time enough to have changed
          expect(ss.imgs[0].style[ss.trProp]).toEqual(ss.visVal.toString() + ss.unit);

          ss.dispose();

          done();

        }, timeEnoughToEndTransition);
      }, timeEnoughToStartTransition);

    });

    it('should handle z-index during transition without remove anim', function(done) {

      var ss = getNewSlider({
        autoPlay: true,
        transitionProperty:'width',
        startValue:'0px',
        visibleValue:'612px',
        endValue:'612px',
        transitionDelay: 0.5,
        transitionDuration: 0.2
      }, 5);

      // Simulates the state after a full carousel round
      var i = ss.imgs.length;
      while (--i >= 0) {
        ss.imgs[i].style.zIndex = 1;
      }

      var startIndex = ss.actualIndex;
      var timeEnoughToStartTransition = (ss.delay) + 100;

      setTimeout(function() {

        expect(ss.imgs[0].style.zIndex).toBeGreaterThan(ss.imgs[4].style.zIndex);

        ss.dispose();

        done();

      }, timeEnoughToStartTransition);

    });

    it('should allow transition to lower values than visible value', function(done) {

      var initialTime = new Date().getTime();
      var ss = getNewSlider({
        autoPlay: true,
        transitionProperty:'left',
        startValue:'612px',
        visibleValue:'0px',
        endValue:'-612px',
        transitionDelay: 0.5,
        transitionDuration: 0.5
      }, 5);

      var timeEnoughToHalftransition = ss.delay + ((ss.trTime / 2) * 1000);

      setTimeout(function() {

        // Only execute asserts if interval is within the correct time
        if (initialTime < new Date().getTime() + 450) {

          // Should be somewhere in the middle of animation values
          expect(parseInt(ss.imgs[0].style.left, 10)).toBeLessThan(0);
          expect(parseInt(ss.imgs[0].style.left, 10)).toBeGreaterThan(-612);

          expect(parseInt(ss.imgs[1].style.left, 10)).toBeLessThan(612);
          expect(parseInt(ss.imgs[1].style.left, 10)).toBeGreaterThan(0);
        }

        ss.dispose();

        done();

      }, timeEnoughToHalftransition);

    });

    it('should allow opacity remove transition', function(done) {

      var initialTime = new Date().getTime();
      var ss = getNewSlider({
        autoPlay: true,
        transitionProperty:'opacity',
        startValue: 0,
        visibleValue: 1,
        endValue: 0,
        transitionDelay: 0.5,
        transitionDuration: 0.5
      }, 5);

      var timeEnoughToHalftransition = ss.delay + ((ss.trTime / 2) * 1000);

      setTimeout(function() {

        // Only execute asserts if interval is within the correct time
        if (initialTime < new Date().getTime() + 450) {

          // Should be somewhere in the middle of remove animation
          expect(ss.imgs[0].style.opacity).toBeLessThan(1);
          expect(ss.imgs[0].style.opacity).toBeGreaterThan(0);
        }

        ss.dispose();

        done();

      }, timeEnoughToHalftransition);

    });

    it('should be able to pause autoplay', function(done) {

      var initialTime = new Date().getTime();
      var ss = getNewSlider({
        autoPlay: true,
        transitionDelay: 0.5,
        transitionDuration: 0.5
      }, 5);

      var timeEnoughToHalftransition = ((ss.delay + (ss.trTime / 2)));

      setTimeout(function() {

        ss.pauseAutoPlay();

        expect(ss.remainingTime).toBeLessThan(timeEnoughToHalftransition);

        ss.dispose();

        done();

      }, timeEnoughToHalftransition);

    });

  });

});
