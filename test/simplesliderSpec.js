describe('SimpleSlider', function() {

  'use strict';

  var testDivCount = 0;

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

  });

  it('should throw an warning if using an empty html element', function() {

    spyOn(console, 'warn');
    new SimpleSlider(document.createElement('div'));
    expect(console.warn).toHaveBeenCalled();

  });

  it('properties should be defined properly', function() {

    // Test default values
    var ss = getNewSlider();
    expect(ss.trProp).toEqual('opacity');
    expect(ss.trTime).toEqual(0.5);
    expect(ss.delay).toEqual(2);
    expect(ss.startVal).toEqual(100);
    expect(ss.endVal).toEqual(0);
    expect(ss.autoPlay).toEqual(true);

    // Test some custom values
    ss = getNewSlider({
      transitionProperty: 'left',
      transitionTime: 1,
      transitionDelay: 2,
      startValue: 300,
      endValue: 100,
      autoPlay:false
    });
    expect(ss.trProp).toEqual('left');
    expect(ss.trTime).toEqual(1);
    expect(ss.delay).toEqual(2);
    expect(ss.startVal).toEqual(300);
    expect(ss.endVal).toEqual(100);
    expect(ss.autoPlay).toEqual(false);

    // Partially defined values
    ss = getNewSlider({
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

  describe('slideshow animation logic', function(done) {

    var ss = getNewSlider({}, 5);
    var nextIndex = ss.actualIndex+1;
    var timeEnoughToStartTransition = (ss.delay*1000)+1;
    var timeEnoughToEndTransition = ss.trTime*1000+1;

    it('should have correct initial values', function() {

      expect(ss.imgs[0].style[ss.trProp]).toEqual(ss.startVal.toString());
      expect(ss.imgs[1].style[ss.trProp]).toEqual(ss.endVal.toString());

    });

    it('should change values correctly after transition time', function() {

      setTimeout(function() {

        // Internal index value is correct
        expect(ss.actualIndex).toEqual(nextIndex);

        setTimeout(function() {

          // Test values after finishing the first transition
          expect(ss.imgs[0].style[ss.trProp]).toEqual(ss.endVal.toString());
          expect(ss.imgs[1].style[ss.trProp]).toEqual(ss.startVal.toString());

          done();

        }, timeEnoughToEndTransition);
      }, timeEnoughToStartTransition);

    });

  });

});
