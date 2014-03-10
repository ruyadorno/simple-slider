(function (context, definition) {

  'use strict';

  if (typeof module != 'undefined' && module.exports) {
    module.exports = definition();
  } else if (typeof define == 'function' && define.amd) {
    define(definition);
  } else {
    context.SimpleSlider = definition();
  }

})(this, function () {

  'use strict';

  // requestAnimationFrame polyfill

  if (!Date.now)
    Date.now = function() { return new Date().getTime(); };

  var vendors = ['webkit', 'moz'];
  for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
    var vp = vendors[i];
    window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
    window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame'] || window[vp+'CancelRequestAnimationFrame']);
  }

  if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || // iOS6 is buggy
    !window.requestAnimationFrame || !window.cancelAnimationFrame) {
    var lastTime = 0;
    window.requestAnimationFrame = function(callback) {
      var now = Date.now();
      var nextTime = Math.max(lastTime + 16, now);
      return setTimeout(function() { callback(lastTime = nextTime); }, nextTime - now);
    };
    window.cancelAnimationFrame = clearTimeout;
  }

  // ------------------

  function getdef(val, def){
    return val===undefined || val===null || val==='' ? def : val;
  }

  // Extracts the unit from a css value
  function getUnit(args, transitionProperty) {

    var item;
    var count = args.length;
    var unit = '';

    while (--count >= 0) {
      item = args[count];
      if (typeof item === 'string') {
        unit = item
          .replace(parseInt(item, 10) + '', '');
      }
    }

    // Defaults unit to px if transition property isn't opacity
    if (transitionProperty !== 'opacity' && unit === '') {
      unit = 'px';
    }

    return unit;

  }

  // Test if have children and throw warning otherwise
  function testChildrenNum(value) {

    if (value <= 0) {
      try {
        console.warn(
          'A SimpleSlider main container element' +
          'should have at least one child.'
        );
      } catch(e) {}

      return true;

    } else {

      return false;
    }

  }

  function anim(target, prop, unit, transitionDuration, startTime, elapsedTime, fromValue, toValue, zIndex, easeFunc){

    function loop() {

      window.requestAnimationFrame(function requestAnimationFunction(time){

        // Starts time in the first anim iteration
        if (startTime === 0) {
          startTime = time;
        }

        anim(target, prop, unit, transitionDuration, startTime, time, fromValue, toValue, zIndex, easeFunc);

      });
    }

    var newValue;

    if (startTime === 0) {

      return loop();

    } else {

      newValue = easeFunc(elapsedTime - startTime, fromValue, toValue - fromValue, transitionDuration);

      if (newValue < toValue) {

        target[prop] = newValue + unit;

        loop();

      } else {

        target[prop] = (toValue) + unit;
        target.zIndex = zIndex;
      }
    }

  }

  function startSlides(container, unit, startValue, visibleValue, transitionProperty) {

    var imgs = [];
    var i = container.children.length;

    while (--i >= 0) {
      imgs[i] = container.children[i];
      imgs[i].style.position = 'absolute';
      imgs[i].style.top = '0' + unit;
      imgs[i].style.left = '0' + unit;
      imgs[i].style[transitionProperty] = startValue + unit;
      imgs[i].style.zIndex = 0;
    }

    imgs[0].style[transitionProperty] = visibleValue + unit;
    imgs[0].style.zIndex = 1;

    return imgs;

  }

  // ------------------

  var SimpleSlider = function(containerElem, options){

    this.containerElem = containerElem;
    this.interval = 0;

    // User might not send any custom options at all
    if( !options ) {
      options = {};
    }

    var width = parseInt(this.containerElem.style.width || this.containerElem.offsetWidth, 10);

    // Get user defined options or its default values
    this.trProp = getdef(options.transitionProperty, 'left');
    this.trTime = getdef(options.transitionDuration, 0.5);
    this.delay = getdef(options.transitionDelay, 3);
    this.unit = getUnit([options.startValue, options.visibleValue, options.endValue], this.trProp);
    this.startVal = parseInt(getdef(options.startValue, -width + this.unit), 10);
    this.visVal = parseInt(getdef(options.visibleValue, '0' + this.unit), 10);
    this.endVal = parseInt(getdef(options.endValue, width + this.unit), 10);
    this.autoPlay = getdef(options.autoPlay, true);
    this.ease = getdef(options.ease, SimpleSlider.defaultEase);

    this.init();
  };

  SimpleSlider.defaultEase = function (time, begin, change, duration) {

    if ((time = time / (duration / 2)) < 1) {
      return change / 2 * time * time * time + begin;
    } else {
      return change / 2 * ((time -= 2) * time * time + 2) + begin;
    }

  };

  SimpleSlider.easeNone = function(time, begin, change, duration) {

    return change * time / duration + begin;

  };

  SimpleSlider.prototype.init = function() {

    this.reset();
    this.configSlideshow();

  };

  SimpleSlider.prototype.reset = function() {

    if (testChildrenNum(this.containerElem.children.length)) {
      return; // Skip reset logic if don't have children
    }

    this.containerElem.style.position = 'relative';
    this.containerElem.style.overflow = 'hidden';
    this.containerElem.style.display = 'block';

    this.imgs = startSlides(this.containerElem, this.unit, this.startVal, this.visVal, this.trProp);

    this.actualIndex = 0;

  };

  SimpleSlider.prototype.configSlideshow = function() {

    if (!this.imgs) {
      return;
    }

    if (this.autoPlay) {

      var scope = this;

      if (this.interval) {

        window.clearInterval(this.interval);

      } else {

        this.interval = window.setInterval(function(){
          scope.change(scope.nextIndex());
        }, this.delay * 1000);

      }
    }

  };

  SimpleSlider.prototype.startAnim = function(target, fromValue, toValue, zIndex){

    anim(target.style, this.trProp, this.unit, this.trTime * 1000, 0, 0, fromValue, toValue, zIndex, SimpleSlider.defaultEase);

  };

  SimpleSlider.prototype.remove = function(index){

    this.imgs[index].style.zIndex = 3;
    this.startAnim(this.imgs[index], this.visVal, this.endVal, 1);

  };

  SimpleSlider.prototype.insert = function(index){

    this.imgs[index].style.zIndex = 4;
    this.startAnim(this.imgs[index], this.startVal, this.visVal, 2);

  };

  SimpleSlider.prototype.change = function(newIndex){

    this.remove(this.actualIndex);
    this.insert(newIndex);

    this.actualIndex = newIndex;

  };

  SimpleSlider.prototype.nextIndex = function(){

    var newIndex = this.actualIndex+1;

    if (newIndex >= this.imgs.length) {
      newIndex = 0;
    }

    return newIndex;

  };

  SimpleSlider.prototype.dispose = function(){

    window.clearInterval(this.interval);

    var i = this.imgs.length;
    while (--i >= 0) {
      this.imgs.pop();
    }
    this.imgs = null;

    this.containerElem = null;
    this.interval = null;
    this.trProp = null;
    this.trTime = null;
    this.delay = null;
    this.startVal = null;
    this.endVal = null;
    this.autoPlay = null;
    this.actualIndex = null;
  };

  return SimpleSlider;

});
