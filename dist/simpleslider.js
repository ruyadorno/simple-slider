'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function getdef(val, def) {
  return val === undefined || val === null || val === '' ? def : val;
}

function getUnit(args, transitionProperty) {
  var item;
  var count = args.length;
  var unit = '';

  while (--count >= 0) {
    item = args[count];
    if (typeof item === 'string') {
      unit = item.replace(String(parseInt(item, 10)), '');
    }
  }

  if (transitionProperty !== 'opacity' && unit === '') {
    unit = 'px';
  }

  return unit;
}

function testChildrenNum(value) {
  if (value <= 0) {
    console.warn('A SimpleSlider main container element' + 'should have at least one child.');

    return true;
  }

  return false;
}

function startSlides(containerElem, unit, startVal, visVal, trProp) {
  var imgs = [];
  var i = containerElem.children.length;
  var style = void 0;

  while (--i >= 0) {
    imgs[i] = containerElem.children[i];
    style = imgs[i].style;
    style.position = 'absolute';
    style.top = '0' + unit;
    style.left = '0' + unit;
    style[trProp] = startVal + unit;
    style.zIndex = 0;
  }

  imgs[0].style[trProp] = visVal + unit;
  imgs[0].style.zIndex = 1;

  return imgs;
}

function manageRemovingSlideOrder(oldSlide, newSlide) {
  newSlide.style.zIndex = 3;

  if (oldSlide) {
    oldSlide.style.zIndex = 1;
  }

  return newSlide;
}

function manageInsertingSlideOrder(oldSlide, newSlide) {
  newSlide.style.zIndex = 4;

  if (oldSlide) {
    oldSlide.style.zIndex = 2;
  }

  return newSlide;
}

function parseStringToBoolean(value) {
  return value === 'false' ? false : value;
}

function updateVisibility(slider) {
  if (window.document.hidden) {
    slider.pause();
  } else {
    slider.resume();
  }
}

function getSlider(containerElem, options) {
  options = options || {};
  var actualIndex = void 0,
      hasVisibilityHandler = void 0,
      inserted = void 0,
      interval = void 0,
      intervalStartTime = void 0,
      imgs = void 0,
      remainingTime = void 0,
      removed = void 0;
  var width = parseInt(containerElem.style.width || containerElem.offsetWidth, 10);

  var trProp = getdef(options.transitionProperty, 'left');
  var trTime = getdef(options.transitionDuration, 0.5);
  var delay = getdef(options.transitionDelay, 3) * 1000;
  var unit = getUnit([options.startValue, options.visibleValue, options.endValue], trProp);
  var startVal = parseInt(getdef(options.startValue, -width + unit), 10);
  var visVal = parseInt(getdef(options.visibleValue, '0' + unit), 10);
  var endVal = parseInt(getdef(options.endValue, width + unit), 10);
  var autoPlay = getdef(parseStringToBoolean(options.autoPlay), true);
  var ease = getdef(options.ease, getSlider.defaultEase);
  var onChange = getdef(options.onChange, null);
  var onChangeEnd = getdef(options.onChangeEnd, null);

  function reset() {
    if (testChildrenNum(containerElem.children.length)) {
      return;
    }

    var style = containerElem.style;
    style.position = 'relative';
    style.overflow = 'hidden';
    style.display = 'block';

    imgs = startSlides(containerElem, unit, startVal, visVal, trProp);
    actualIndex = 0;
    inserted = removed = null;
    remainingTime = delay;
  }

  function configSlideshow() {
    if (imgs) {
      startInterval();
    }
  }

  function startInterval() {
    if (!isAutoPlay()) {
      return;
    }

    if (interval) {
      window.clearTimeout(interval);
    }

    (function setAutoPlayLoop() {
      intervalStartTime = Date.now();
      interval = window.setTimeout(function () {
        intervalStartTime = Date.now();
        remainingTime = delay;

        change(nextIndex());

        setAutoPlayLoop();
      }, remainingTime);
    })();

    if (!hasVisibilityHandler) {
      window.document.addEventListener('visibilitychange', updateVisibility, false);

      hasVisibilityHandler = true;
    }
  }

  function isAutoPlay() {
    return autoPlay && imgs.length > 1;
  }

  function pause() {
    if (isAutoPlay()) {
      remainingTime = delay - (Date.now() - intervalStartTime);
      window.clearTimeout(interval);
      interval = null;
    }
  }

  function resume() {
    startInterval();
  }

  function startAnim(target, fromValue, toValue, cb) {
    anim(target.style, trProp, unit, trTime * 1000, 0, 0, fromValue, toValue, ease, cb);
  }

  function endAnim() {
    if (onChangeEnd) {
      onChangeEnd(actualIndex, nextIndex());
    }
  }

  function remove(index) {
    removed = manageRemovingSlideOrder(removed, imgs[index]);
    startAnim(imgs[index], visVal, endVal);
  }

  function change(newIndex) {
    var prevIndex = actualIndex;

    remove(actualIndex);
    insert(newIndex);

    actualIndex = newIndex;

    if (onChange) {
      onChange(prevIndex, actualIndex);
    }
  }

  function insert(index) {
    inserted = manageInsertingSlideOrder(inserted, imgs[index]);
    startAnim(imgs[index], startVal, visVal, endAnim);
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
    window.clearTimeout(interval);

    imgs = containerElem = interval = trProp = trTime = delay = startVal = endVal = autoPlay = actualIndex = inserted = removed = remainingTime = onChange = onChangeEnd = null;
  }

  function currentIndex() {
    return actualIndex;
  }

  function anim(target, prop, unit, transitionDuration, startTime, elapsedTime, fromValue, toValue, easeFunc, cb) {
    function loop(_cb) {
      window.requestAnimationFrame(function requestAnimationFunction(time) {
        if (startTime === 0) {
          startTime = time;
        }

        anim(target, prop, unit, transitionDuration, startTime, time, fromValue, toValue, easeFunc, _cb);
      });
    }

    var newValue;

    if (startTime > 0) {
      newValue = easeFunc(elapsedTime - startTime, fromValue, toValue - fromValue, transitionDuration);

      if (elapsedTime - startTime <= transitionDuration) {
        target[prop] = newValue + unit;
      } else {
        target[prop] = toValue + unit;

        if (cb) {
          cb();
          cb = null;
        }

        return;
      }
    }

    loop(cb);
  }

  reset();
  configSlideshow();

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
    dispose: dispose,
    onChange: onChange,
    onChangeEnd: onChangeEnd
  };
}

getSlider.defaultEase = function (time, begin, change, duration) {
  return (time = time / (duration / 2)) < 1 ? change / 2 * time * time * time + begin : change / 2 * ((time -= 2) * time * time + 2) + begin;
};

getSlider.easeNone = function (time, begin, change, duration) {
  return change * time / duration + begin;
};

exports.default = getSlider;
