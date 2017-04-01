(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.simpleslider = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  function getdef(val, def) {
    return val == null ? def : val;
  }

  function startSlides(containerElem, children, unit, startVal, visVal, trProp) {
    var imgs = [];

    if (!children) {
      children = containerElem.children;
    }

    var i = children.length;
    var style = void 0;

    while (--i >= 0) {
      imgs[i] = children[i];
      style = imgs[i].style;
      style.position = 'absolute';
      style.top = style.left = style.zIndex = 0;
      style[trProp] = startVal + unit;
    }

    imgs[0].style[trProp] = visVal + unit;
    imgs[0].style.zIndex = 1;

    return imgs;
  }

  function getSlider(options) {
    options = options || {};
    var actualIndex = void 0,
        hasVisibilityHandler = void 0,
        inserted = void 0,
        interval = void 0,
        intervalStartTime = void 0,
        imgs = void 0,
        remainingTime = void 0,
        removed = void 0;

    var containerElem = getdef(options.container, document.querySelector('*[data-simple-slider]'));
    var width = parseInt(containerElem.style.width || containerElem.offsetWidth);
    var trProp = getdef(options.transitionProperty, 'left');
    var trTime = getdef(options.transitionDuration, 0.5);
    var delay = getdef(options.transitionDelay, 3) * 1000;
    var unit = getdef(options.unit, 'px');
    var startVal = parseInt(getdef(options.startValue, -width + unit));
    var visVal = parseInt(getdef(options.visibleValue, '0' + unit));
    var endVal = parseInt(getdef(options.endValue, width + unit));
    var paused = options.paused;
    var ease = getdef(options.ease, getSlider.defaultEase);
    var onChange = getdef(options.onChange, null);
    var onChangeEnd = getdef(options.onChangeEnd, null);

    function reset() {
      if (containerElem.children.length <= 0) {
        return;
      }

      var style = containerElem.style;
      style.position = 'relative';
      style.overflow = 'hidden';
      style.display = 'block';

      imgs = startSlides(containerElem, options.children, unit, startVal, visVal, trProp);
      actualIndex = 0;
      inserted = removed = null;
      remainingTime = delay;
    }

    function startInterval() {
      if (isAutoPlay()) {
        if (interval) {
          clearTimeout(interval);
        }

        (function setAutoPlayLoop() {
          intervalStartTime = Date.now();
          interval = setTimeout(function () {
            intervalStartTime = Date.now();
            remainingTime = delay;

            change(nextIndex());

            setAutoPlayLoop();
          }, remainingTime);
        })();

        if (!hasVisibilityHandler) {
          document.addEventListener('visibilitychange', function () {
            return document.hidden ? pause() : resume();
          }, false);

          hasVisibilityHandler = 1;
        }
      }
    }

    function isAutoPlay() {
      return !paused && imgs.length > 1;
    }

    function pause() {
      if (isAutoPlay()) {
        remainingTime = delay - (Date.now() - intervalStartTime);
        clearTimeout(interval);
        interval = null;
      }
    }

    function resume() {
      startInterval();
    }

    function reverse() {
      var newEndVal = startVal;
      startVal = endVal;
      endVal = newEndVal;
      actualIndex = Math.abs(actualIndex - (imgs.length - 1));
      imgs = imgs.reverse();
    }

    function change(newIndex) {
      var count = imgs.length;
      while (--count >= 0) {
        imgs[count].style.zIndex = 1;
      }

      imgs[newIndex].style.zIndex = 3;
      imgs[actualIndex].style.zIndex = 2;

      anim([{
        elem: imgs[actualIndex].style,
        from: visVal,
        to: endVal
      }, {
        elem: imgs[newIndex].style,
        from: startVal,
        to: visVal
      }], trTime * 1000, 0, 0, ease);

      actualIndex = newIndex;

      if (onChange) {
        onChange(prevIndex(), actualIndex);
      }
    }

    function next() {
      change(nextIndex());
      startInterval();
    }

    function prev() {
      change(prevIndex());
      startInterval();
    }

    function nextIndex() {
      var newIndex = actualIndex + 1;

      if (newIndex >= imgs.length) {
        newIndex = 0;
      }

      return newIndex;
    }

    function prevIndex() {
      var newIndex = actualIndex - 1;

      if (newIndex < 0) {
        newIndex = imgs.length - 1;
      }

      return newIndex;
    }

    function dispose() {
      clearTimeout(interval);

      imgs = containerElem = interval = trProp = trTime = delay = startVal = endVal = paused = actualIndex = inserted = removed = remainingTime = onChange = onChangeEnd = null;
    }

    function currentIndex() {
      return actualIndex;
    }

    function anim(targets, transitionDuration, startTime, elapsedTime, easeFunc) {
      var count = targets.length;

      while (--count >= 0) {
        var target = targets[count];
        var newValue = void 0;
        if (startTime > 0) {
          newValue = easeFunc(elapsedTime - startTime, target.from, target.to - target.from, transitionDuration);

          if (elapsedTime - startTime < transitionDuration) {
            target.elem[trProp] = newValue + unit;
          } else {
            count = targets.length;
            while (--count >= 0) {
              target = targets[count];
              target.elem[trProp] = target.to + unit;
            }

            if (onChangeEnd) {
              onChangeEnd(actualIndex, nextIndex());
            }
            return;
          }
        }
      }

      requestAnimationFrame(function (time) {
        if (startTime === 0) {
          startTime = time;
        }

        anim(targets, transitionDuration, startTime, time, easeFunc);
      });
    }

    reset();

    if (imgs && imgs.length > 1) {
      startInterval();
    }

    return {
      currentIndex: currentIndex,
      isAutoPlay: isAutoPlay,
      pause: pause,
      resume: resume,
      nextIndex: nextIndex,
      prevIndex: prevIndex,
      next: next,
      prev: prev,
      change: change,
      reverse: reverse,
      dispose: dispose
    };
  }

  getSlider.defaultEase = function (time, begin, change, duration) {
    return (time = time / (duration / 2)) < 1 ? change / 2 * time * time * time + begin : change / 2 * ((time -= 2) * time * time + 2) + begin;
  };

  getSlider.easeNone = function (time, begin, change, duration) {
    return change * time / duration + begin;
  };

  exports.default = getSlider;
});