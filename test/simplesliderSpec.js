describe('SimpleSlider', function() {

  'use strict';

  var testDivCount = 0;

  // Helper functions to create dummy elements

  var getNewDiv = function(numChild) {

    var newDiv = document.createElement('div');
    newDiv.id = 'test-div-' + testDivCount;
    testDivCount++;

    addChildrenDivs(newDiv, numChild);

    return newDiv;

  };

  var addChildrenDivs = function(newDiv, numChild) {

    var childrenNum = numChild ? numChild : Math.ceil( Math.random()*10 );
    while (childrenNum >= 0) {
      newDiv.appendChild(document.createElement('div'));
      childrenNum--;
    }

  };

  var getNewSlider = function(options, numChild) {

    var testDiv = getNewDiv(numChild);
    var ss = new SimpleSlider(testDiv, options);

    return ss;

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
    expect(ss.trProp).toEqual('opacity');
    expect(ss.trTime).toEqual(0.5);
    expect(ss.delay).toEqual(2);
    expect(ss.startVal).toEqual(0);
    expect(ss.visVal).toEqual(1);
    expect(ss.endVal).toEqual(0);
    expect(ss.autoPlay).toEqual(true);

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
      expect(ss.imgs[i].style.left).toEqual('0px');
    }

  });

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

  describe('slideshow animation logic', function() {

    it('should have correct default initial values', function() {

      var ss = getNewSlider({}, 5);

      expect(ss.imgs[0].style[ss.trProp]).toEqual(ss.visVal.toString());
      expect(ss.imgs[1].style[ss.trProp]).toEqual(ss.startVal.toString());

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
          expect(ss.imgs[0].style[ss.trProp]).toEqual(ss.endVal.toString());
          expect(ss.imgs[1].style[ss.trProp]).toEqual(ss.visVal.toString());

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
          expect(ss.imgs[0].style[ss.trProp]).toEqual(ss.endVal.toString());
          expect(ss.imgs[1].style[ss.trProp]).toEqual(ss.visVal.toString());

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
          expect(ss.imgs[0].style[ss.trProp]).toEqual(ss.visVal.toString());
          expect(ss.imgs[1].style[ss.trProp]).toEqual(ss.startVal.toString());

          done();

        }, timeEnoughToEndTransition);
      }, timeEnoughToStartTransition);

    });

  });

});
