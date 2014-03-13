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

  it('should be able to create a new instance', function() {

    var ss = getNewSlider();
    expect(typeof ss).toEqual('object');
    expect(ss instanceof SimpleSlider).toBeTruthy();

    ss.dispose();

  });

  it('should throw an warning if using an empty html element', function() {

    spyOn(console, 'warn');
    new SimpleSlider(document.createElement('div'));
    expect(console.warn).toHaveBeenCalled();

  });

  it('default properties should match', function() {

    // Test default values
    var ss = getNewSlider();
    var width = parseInt(ss.containerElem.style.width, 10);
    expect(ss.trProp).toEqual('left');
    expect(ss.trTime).toEqual(0.5);
    expect(ss.delay).toEqual(3);
    expect(ss.startVal).toEqual(-width);
    expect(ss.visVal).toEqual(0);
    expect(ss.endVal).toEqual(width);
    expect(ss.autoPlay).toEqual(true);
    expect(ss.ease).toEqual(SimpleSlider.defaultEase);

    ss.dispose();

  });

  it('properties should be defined properly', function() {

    // Test some custom values
    var ss = getNewSlider({
      transitionProperty: 'left',
      transitionDuration: 1,
      transitionDelay: 2,
      startValue: 300,
      visibleValue: 200,
      endValue: 100,
      autoPlay:false
    });
    expect(ss.trProp).toEqual('left');
    expect(ss.trTime).toEqual(1);
    expect(ss.delay).toEqual(2);
    expect(ss.startVal).toEqual(300);
    expect(ss.visVal).toEqual(200);
    expect(ss.endVal).toEqual(100);
    expect(ss.autoPlay).toEqual(false);

  });

  it('should work when partialy declaring properties', function() {

    // Partially defined values
    var ss = getNewSlider({
      transitionProperty: 'top',
      startValue: -100,
      autoPlay:false
    });
    expect(ss.trProp).toEqual('top');
    expect(ss.startVal).toEqual(-100);
    expect(ss.autoPlay).toEqual(false);

  });

  it('after init should contain imgs data', function() {

    var newDiv = getNewDiv();
    var ss = new SimpleSlider(newDiv);
    var countChildren = newDiv.children.length-1;

    expect(ss.imgs.length).toEqual(newDiv.children.length);

    while (countChildren>=0) {
      expect(ss.imgs).toContain(newDiv.children[countChildren]);
      countChildren--;
    }

  });

  it('should set initial styling on elements', function () {

    var ss = getNewSlider({}, 5);

    expect(ss.containerElem.style.position).toEqual('relative');
    expect(ss.containerElem.style.overflow).toEqual('hidden');

    var i = ss.containerElem.children.length;

    while (--i >= 0) {
      expect(ss.imgs[i].style.position).toEqual('absolute');
      expect(ss.imgs[i].style.top).toEqual('0px');

      // Only the first one should be on visible state
      if (i === 0) {
        expect(ss.imgs[i].style.left).toEqual('0px');
      } else {
        expect(ss.imgs[i].style.left).toEqual('-480px');
      }
    }

  });

  it('should be able to get px units correctly', function() {

    var ss = getNewSlider({
      transitionProperty: 'left',
      endValue: '300px'
    }, 5);

    expect(ss.unit).toEqual('px');

    ss.dispose();

  });

  it('should be able to get em units correctly', function() {

    // Also tests with em and a smaller number
    var ss = getNewSlider({
      transitionProperty: 'width',
      startValue: '3em'
    }, 3);

    expect(ss.unit).toEqual('em');

    ss.dispose();

  });

  it('should be able to get % units correctly', function() {

    // Should also get when using visibleValue
    var ss = getNewSlider({
      visibleValue: '100%'
    }, 3);

    expect(ss.unit).toEqual('%');

    ss.dispose();

  });

  describe('.reset()', function() {

    it('should reset original style values', function() {

      var ss = getNewSlider({
        autoPlay: false
      }, 5);

      ss.change(3);

      ss.reset();

      expect(ss.containerElem.style.position).toEqual('relative');
      expect(ss.containerElem.style.overflow).toEqual('hidden');
      expect(ss.containerElem.style.display).toEqual('block');

      ss.dispose();

    });

    it('should start imgs control', function() {

      var ss = getNewSlider({
        autoPlay: false
      }, 5);

      ss.change(3);

      ss.reset();

      expect(ss.imgs.length).toEqual(5);

      ss.dispose();

    });

    it('should set actualIndex to 0', function() {

      var ss = getNewSlider({
        autoPlay: false
      }, 5);

      ss.change(3);

      ss.reset();

      expect(ss.actualIndex).toEqual(0);

      ss.dispose();

    });

    it('should set initial image properties values', function() {

      var ss = getNewSlider({
        autoPlay: false
      }, 5);

      ss.change(3);

      ss.reset();

      expect(ss.imgs[0].style[ss.trProp]).toEqual(ss.visVal.toString() + ss.unit);
      expect(ss.imgs[1].style[ss.trProp]).toEqual(ss.startVal.toString() + ss.unit);

      ss.dispose();

    });

    it('should nullify inserted, removed objects', function() {

      var ss = getNewSlider({
        autoPlay: false
      }, 5);

      ss.change(3);

      ss.reset();

      expect(ss.inserted).toEqual(null);
      expect(ss.removed).toEqual(null);

      ss.dispose();

    });

  });

  describe('.configSlideshow()', function() {

    it('should return false if there are no images', function() {

      var ss = createEmptySlider();

      expect(ss.configSlideshow()).toEqual(false);

      disposeEmptySlider(ss);

    });

    it('should not create change image interval if there are no images', function() {

      var ss = createEmptySlider();

      ss.configSlideshow();

      expect(ss.interval).toEqual(null);

      disposeEmptySlider(ss);

    });

    it('should create interval when configuring a valid slider', function() {

      var ss = getNewSlider({}, 5);

      ss.configSlideshow();

      expect(ss.interval).not.toEqual(null);

      ss.dispose();

    });

  });

  describe('.remove()', function() {

    it('should trigger startAnim with correct values', function() {

      var ss = getNewSlider({
        autoPlay: false
      }, 5);

      spyOn(ss, 'startAnim');

      ss.remove(0);

      expect(ss.startAnim).toHaveBeenCalledWith(ss.imgs[0], ss.visVal, ss.endVal);

      ss.dispose();

    });

  });

  describe('.insert()', function() {

    it('should trigger startAnim with correct values', function() {

      var ss = getNewSlider({
        autoPlay: false
      }, 5);

      spyOn(ss, 'startAnim');

      ss.insert(1);

      expect(ss.startAnim).toHaveBeenCalledWith(ss.imgs[1], ss.startVal, ss.visVal);

      ss.dispose();

    });

  });

  describe('.nextIndex()', function() {

    it('should return next index value on carousel', function() {

      var ss = getNewSlider({
        autoPlay: false
      }, 5);

      // Original value should always be zero
      expect(ss.actualIndex).toEqual(0);

      // Next index should not increment actualIndex value
      expect(ss.nextIndex()).toEqual(1);

      ss.dispose();

    });

    it('should return first item index when it is on last item', function() {

      var ss = getNewSlider({
        autoPlay: false
      }, 5);

      ss.change(4);

      expect(ss.nextIndex()).toEqual(0);

      ss.dispose();

    });

    it('should not increment actualIndex value', function() {

      var ss = getNewSlider({
        autoPlay: false
      }, 5);

      // Next index should not increment actualIndex value
      expect(ss.nextIndex()).toEqual(1);
      expect(ss.nextIndex()).toEqual(1);

      ss.dispose();

    });

  });

  describe('.dispose()', function() {

    it('should dispose created instances', function() {

      var ss = getNewSlider({
        transitionProperty: 'opacity'
      }, 5);

      ss.dispose();

      expect(ss.imgs).toEqual(null);
      expect(ss.actualIndex).toEqual(null);
      expect(ss.interval).toEqual(null);
      expect(ss.containerElem).toEqual(null);

    });

    it('dispose should clear autoplay interval', function(done) {

      var ss = getNewSlider({
        autoPlay: true,
        transitionProperty: 'opacity'
      }, 5);

      // spy on change method
      spyOn(ss, 'change');

      ss.dispose();

      setTimeout(function() {
        expect(ss.change).not.toHaveBeenCalled();
        done();
      }, (ss.delay * 1000) + 1);

    });

  });

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
      var timeEnoughToStartTransition = (ss.delay * 1000) + 100;
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
      var timeEnoughToStartTransition = (ss.delay * 1000) + 100;
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
      var timeEnoughToStartTransition = (ss.delay * 1000) + 100;
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
      var timeEnoughToStartTransition = (ss.delay * 1000) + 100;
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
      var timeEnoughToStartTransition = (ss.delay * 1000) + 10;
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
      var timeEnoughToStartTransition = (ss.delay * 1000) + 100;
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
      var timeEnoughToStartTransition = (ss.delay * 1000) + 100;

      setTimeout(function() {

        expect(ss.imgs[0].style.zIndex).toBeGreaterThan(ss.imgs[4].style.zIndex);

        ss.dispose();

        done();

      }, timeEnoughToStartTransition);

    });

    it('should allow transition to lower values than visible value', function(done) {

      var ss = getNewSlider({
        autoPlay: true,
        transitionProperty:'left',
        startValue:'612px',
        visibleValue:'0px',
        endValue:'-612px',
        transitionDelay: 0,
        transitionDuration: 0.2
      }, 5);

      var timeEnoughToHalftransition = ((ss.trTime / 2) * 1000);

      setTimeout(function() {

        // Should be somewhere in the middle of animation values
        expect(parseInt(ss.imgs[0].style.left, 10)).toBeLessThan(0);
        expect(parseInt(ss.imgs[0].style.left, 10)).toBeGreaterThan(-612);

        expect(parseInt(ss.imgs[1].style.left, 10)).toBeLessThan(612);
        expect(parseInt(ss.imgs[1].style.left, 10)).toBeGreaterThan(0);

        ss.dispose();

        done();

      }, timeEnoughToHalftransition);

    });

    it('should allow opacity remove transition', function(done) {

      var ss = getNewSlider({
        autoPlay: true,
        transitionProperty:'opacity',
        startValue: 0,
        visibleValue: 1,
        endValue: 0,
        transitionDelay: 0,
        transitionDuration: 0.2
      }, 5);

      var timeEnoughToHalftransition = ((ss.trTime / 2) * 1000);

      setTimeout(function() {

        // Should be somewhere in the middle of remove animation
        expect(ss.imgs[0].style.opacity).toBeLessThan(1);
        expect(ss.imgs[0].style.opacity).toBeGreaterThan(0);

        ss.dispose();

        done();

      }, timeEnoughToHalftransition);

    });

  });

});
