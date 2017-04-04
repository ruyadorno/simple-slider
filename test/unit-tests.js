/* eslint-env jest */
import {getSlider} from '../src/simpleslider';
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
    return getSlider(Object.assign({
      container: getNewDiv(numChild)
    }, options));
  };

  it('should be able to create a new instance', function () {
    var ss = getNewSlider();
    expect(typeof ss).toEqual('object');

    ss.dispose();
  });

  it('default properties should match', function () {
    // Test default values
    var ss = getNewSlider();
    expect(ss.internalState.paused).toEqual(undefined);
    expect(ss.internalState.trProp).toEqual('left');
    expect(ss.internalState.trTime).toEqual(0.5);
    expect(ss.internalState.delay).toEqual(3000);
    expect(ss.internalState.startVal).toEqual(-100);
    expect(ss.internalState.visVal).toEqual(0);
    expect(ss.internalState.endVal).toEqual(100);
    expect(ss.internalState.ease).toEqual(ss.internalState.defaultEase);

    ss.dispose();
  });

  it('properties should be defined properly', function () {
    // Test some custom values
    var customEasingStub = function () {
      return true;
    };
    var ss = getNewSlider({
      transitionProperty: 'left',
      transitionDuration: 1,
      transitionDelay: 2,
      startValue: 300,
      visibleValue: 200,
      endValue: 100,
      paused: true,
      ease: customEasingStub
    });
    expect(ss.isAutoPlay()).toEqual(false);
    expect(ss.internalState.trProp).toEqual('left');
    expect(ss.internalState.trTime).toEqual(1);
    expect(ss.internalState.delay).toEqual(2000);
    expect(ss.internalState.startVal).toEqual(300);
    expect(ss.internalState.visVal).toEqual(200);
    expect(ss.internalState.endVal).toEqual(100);
    expect(ss.internalState.ease).toEqual(customEasingStub);

    ss.dispose();
  });

  it('should work when partialy declaring properties', function () {
    // Partially defined values
    var ss = getNewSlider({
      transitionProperty: 'top',
      startValue: -100,
      paused: true
    });
    expect(ss.internalState.trProp).toEqual('top');
    expect(ss.internalState.startVal).toEqual(-100);
    expect(ss.isAutoPlay()).toEqual(false);

    ss.dispose();
  });

  it('after init should contain imgs data', function () {
    var newDiv = getNewDiv();
    var ss = getSlider({container: newDiv});
    var countChildren = newDiv.children.length - 1;

    expect(ss.internalState.getImgs().length).toEqual(newDiv.children.length);

    while (countChildren >= 0) {
      expect(ss.internalState.getImgs()).toContain(newDiv.children[countChildren]);
      countChildren--;
    }

    ss.dispose();
  });

  it('should set initial styling on elements', function () {
    var ss = getNewSlider({}, 5);

    expect(ss.internalState.getContainerElem().style.position).toEqual('relative');
    expect(ss.internalState.getContainerElem().style.overflow).toEqual('hidden');

    var i = ss.internalState.getContainerElem().children.length;

    while (--i >= 0) {
      expect(ss.internalState.getImgs()[i].style.position).toEqual('absolute');
      expect(ss.internalState.getImgs()[i].style.top).toEqual('0px');

      // Only the first one should be on visible state
      if (i === 0) {
        expect(ss.internalState.getImgs()[i].style.left).toEqual('0%');
      } else {
        expect(ss.internalState.getImgs()[i].style.left).toEqual('-100%');
      }
    }

    ss.dispose();
  });

  describe('.onChange()', function () {
    it('should call onChange function if defined', function (done) {
      var ss;
      var callback = function () {
        expect(true).toBeTruthy();

        ss.dispose();

        done();
      };

      // Should also get when using visibleValue
      ss = getNewSlider({
        onChange: callback
      }, 3);

      ss.change(2);
    });

    it('should have prevIndex and nextIndex parameters', function (done) {
      var ss;
      var callback = function (prevIndex, nextIndex) {
        expect(prevIndex).toBe(0);
        expect(nextIndex).toBe(1);

        ss.dispose();

        done();
      };

      // Should also get when using visibleValue
      ss = getNewSlider({
        onChange: callback
      }, 3);

      ss.next();
    });
  });

  describe('.onChangeEnd()', function () {
    it('should call onChangeEnd function if defined', function (done) {
      expect.assertions(1);
      var ss;
      var callback = function () {
        expect(true).toBeTruthy();

        ss.dispose();

        done();
      };

      // Should also get when using visibleValue
      ss = getNewSlider({
        transitionDuration: 0.1,
        onChangeEnd: callback
      }, 3);

      ss.change(2);
    });

    it('should have currentIndex and nextIndex parameters', function (done) {
      expect.assertions(2);
      var ss;
      var callback = function (currIndex, nextIndex) {
        expect(currIndex).toBe(1);
        expect(nextIndex).toBe(2);

        ss.dispose();

        done();
      };

      // Should also get when using visibleValue
      ss = getNewSlider({
        onChangeEnd: callback
      }, 3);

      ss.next();
    });
  });

  describe('*internal .reset()', function () {
    it('should reset original style values', function () {
      var ss = getNewSlider({
        paused: true
      }, 5);

      ss.change(3);

      ss.internalState.reset();

      expect(ss.internalState.getContainerElem().style.position).toEqual('relative');
      expect(ss.internalState.getContainerElem().style.overflow).toEqual('hidden');
      expect(ss.internalState.getContainerElem().style.display).toEqual('block');

      ss.dispose();
    });

    it('should start imgs control', function () {
      var ss = getNewSlider({
        paused: true
      }, 5);

      ss.change(3);

      ss.internalState.reset();

      expect(ss.internalState.getImgs().length).toEqual(5);

      ss.dispose();
    });

    it('should set actualIndex to 0', function () {
      var ss = getNewSlider({
        paused: true
      }, 5);

      ss.change(3);

      ss.internalState.reset();

      expect(ss.currentIndex()).toEqual(0);

      ss.dispose();
    });

    it('should set initial image properties values', function () {
      var ss = getNewSlider({
        paused: true
      }, 5);

      ss.change(3);

      ss.internalState.reset();

      expect(ss.internalState.getImgs()[0].style[ss.internalState.trProp]).toEqual(ss.internalState.visVal.toString() + ss.internalState.unit);
      expect(ss.internalState.getImgs()[1].style[ss.internalState.trProp]).toEqual(ss.internalState.startVal.toString() + ss.internalState.unit);

      ss.dispose();
    });

    it('should nullify inserted, removed objects', function () {
      var ss = getNewSlider({
        paused: true
      }, 5);

      ss.change(3);

      ss.internalState.reset();

      expect(ss.internalState.inserted).toEqual(null);
      expect(ss.internalState.removed).toEqual(null);

      ss.dispose();
    });
  });

  describe('.next()', function () {
    it('should change to next slide', function () {
      var ss = getNewSlider({paused: true}, 5);
      var initialIndex = ss.currentIndex();

      ss.next();

      expect(ss.currentIndex()).toEqual(initialIndex + 1);

      ss.dispose();
    });

    it('should change to first slide when current slide is the last in the set', function () {
      var ss = getNewSlider({paused: true}, 5);

      ss.internalState.setActualIndex(4);

      ss.next();

      expect(ss.currentIndex()).toEqual(0);

      ss.dispose();
    });
  });

  describe('.prev()', function () {
    it('should change to previous slide', function () {
      var ss = getNewSlider({paused: true}, 5);

      ss.internalState.setActualIndex(1);

      ss.prev();

      expect(ss.currentIndex()).toEqual(0);

      ss.dispose();
    });

    it('should change to last slide when current slide is the first in the set', function () {
      var ss = getNewSlider({paused: true}, 5);

      ss.prev();

      expect(ss.currentIndex()).toEqual(ss.internalState.getImgs().length - 1);

      ss.dispose();
    });
  });

  describe('.pause()', function () {
    it('should clear slide change setInterval', function () {
      var ss = getNewSlider({}, 5);

      expect(ss.internalState.getInterval()).not.toEqual(null);

      ss.pause();

      expect(ss.internalState.getInterval()).toEqual(null);

      ss.dispose();
    });

    it('*internal should define this.remainingTime value', function () {
      var ss = getNewSlider({}, 5);

      ss.pause();

      // Adds half a second of tolerances
      // it might be some miliseconds off sometimes
      expect(ss.internalState.getRemainingTime()).toBeGreaterThan(ss.internalState.delay - 500);

      // But should never be over the origin delay
      expect(ss.internalState.getRemainingTime()).toBeLessThan(ss.internalState.delay + 1);

      ss.dispose();
    });

    it('should do nothing when autoplay is disabled', function () {
      var ss = getNewSlider({paused: true}, 5);

      ss.pause();

      ss.dispose();
    });
  });

  describe('.resume()', function () {
    it('should re-enable slide changing setInterval', function () {
      var ss = getNewSlider({}, 5);

      ss.pause();

      expect(ss.internalState.getInterval()).toEqual(null);

      ss.resume();

      expect(ss.internalState.getInterval()).not.toEqual(null);

      ss.dispose();
    });

    it('should do nothing when autoplay is disabled', function () {
      var ss = getNewSlider({paused: true}, 5);

      ss.resume();

      ss.dispose();
    });
  });

  describe('.nextIndex()', function () {
    it('should return next index value on carousel', function () {
      var ss = getNewSlider({
        paused: true
      }, 5);

      // Original value should always be zero
      expect(ss.currentIndex()).toEqual(0);

      // Next index should not increment currentIndex() value
      expect(ss.nextIndex()).toEqual(1);

      ss.dispose();
    });

    it('should return first item index when it is on last item', function () {
      var ss = getNewSlider({
        paused: true
      }, 5);

      ss.change(4);

      expect(ss.nextIndex()).toEqual(0);

      ss.dispose();
    });

    it('should not increment currentIndex() value', function () {
      var ss = getNewSlider({
        paused: true
      }, 5);

      // Next index should not increment currentIndex() value
      expect(ss.nextIndex()).toEqual(1);
      expect(ss.nextIndex()).toEqual(1);

      ss.dispose();
    });
  });

  describe('.dispose()', function () {
    it('should dispose created instances', function () {
      var ss = getNewSlider({
        transitionProperty: 'opacity'
      }, 5);

      ss.dispose();

      expect(ss.internalState.getImgs()).toEqual(null);
      expect(ss.currentIndex()).toEqual(null);
      expect(ss.internalState.getInterval()).toEqual(null);
      expect(ss.internalState.getContainerElem()).toEqual(null);
    });

    it('dispose should clear autoplay interval', function (done) {
      var ss = getNewSlider({
        paused: false,
        transitionProperty: 'opacity'
      }, 5);

      // spy on change method
      spyOn(ss, 'change'); // eslint-disable-line no-undef

      ss.dispose();

      setTimeout(function () {
        expect(ss.change).not.toHaveBeenCalled();
        done();
      }, (ss.delay) + 1);
    });
  });

  describe('.reverse()', function () {
    it('should reverse order of slides', function () {
      var ss = getNewSlider({
        transitionProperty: 'opacity'
      }, 5);
      var reversedImgs = ss.internalState.getImgs().slice().reverse();

      expect(ss.internalState.getImgs()).not.toEqual(reversedImgs);
      ss.reverse();
      expect(ss.internalState.getImgs()).toEqual(reversedImgs);
    });
  });
});
