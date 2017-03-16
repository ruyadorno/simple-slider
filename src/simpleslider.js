'use strict';

function getdef(val, def) {
  return val === undefined || val === null || val === '' ? def : val;
}

// Extracts the unit from a css value
function getUnit(args, transitionProperty) {
  var item;
  var count = args.length;
  var unit = '';

  while (--count >= 0) {
    item = args[count];
    if (typeof item === 'string') {
      unit = item.replace(String(parseInt(item)), '');
    }
  }

  // Defaults unit to px if transition property isn't opacity
  if (transitionProperty !== 'opacity' && unit === '') {
    unit = 'px';
  }

  return unit;
}

function startSlides(containerElem, unit, startVal, visVal, trProp) {
  const imgs = [];
  let i = containerElem.children.length;
  let style;

  while (--i >= 0) {
    imgs[i] = containerElem.children[i];
    style = imgs[i].style;
    style.position = 'absolute';
    style.top =
    style.left = '0' + unit;
    style[trProp] = startVal + unit;
    style.zIndex = 0;
  }

  imgs[0].style[trProp] = visVal + unit;
  imgs[0].style.zIndex = 1;

  return imgs;
}

function manageSlideOrder(oldSlide, oldSlidePos, newSlide, newSlidePos) {
  newSlide.style.zIndex = newSlidePos;

  if (oldSlide) {
    oldSlide.style.zIndex = oldSlidePos;
  }

  return newSlide;
}

function getSlider(containerElem, options) {
  options = options || {};
  let actualIndex, hasVisibilityHandler, inserted, interval, intervalStartTime, imgs, remainingTime, removed; // eslint-disable-line one-var
  let width = parseInt(containerElem.style.width || containerElem.offsetWidth);

  // Get user defined options or its default values
  let trProp = getdef(options.transitionProperty, 'left');
  let trTime = getdef(options.transitionDuration, 0.5);
  let delay = getdef(options.transitionDelay, 3) * 1000;
  let unit = getUnit([options.startValue, options.visibleValue, options.endValue], trProp);
  let startVal = parseInt(getdef(options.startValue, -width + unit));
  let visVal = parseInt(getdef(options.visibleValue, '0' + unit));
  let endVal = parseInt(getdef(options.endValue, width + unit));
  let still = options.still; // eslint-disable-line
  let ease = getdef(options.ease, getSlider.defaultEase);
  let onChange = getdef(options.onChange, null);
  let onChangeEnd = getdef(options.onChangeEnd, null);

  function reset() {
    if (containerElem.children.length <= 0) {
      return; // Skip reset logic if don't have children
    }

    var style = containerElem.style;
    style.position = 'relative';
    style.overflow = 'hidden';
    style.display = 'block';

    imgs = startSlides(containerElem, unit, startVal, visVal, trProp);
    actualIndex = 0;
    inserted =
    removed = null;
    remainingTime = delay;
  }

  function startInterval() {
    if (!isAutoPlay()) {
      return;
    }

    if (interval) {
      clearTimeout(interval);
    }

    // Slideshow/autoPlay timing logic
    (function setAutoPlayLoop() {
      intervalStartTime = Date.now();
      interval = setTimeout(() => {
        intervalStartTime = Date.now();
        remainingTime = delay; // resets time, used by pause/resume logic

        change(nextIndex());

        // loops
        setAutoPlayLoop();
      }, remainingTime);
    })();

    // Handles user leaving/activating the current page/tab
    if (!hasVisibilityHandler) {
      document.addEventListener('visibilitychange', () => document.hidden ? pause() : reset(), false);

      // only assign handler once
      hasVisibilityHandler = true;
    }
  }

  function isAutoPlay() {
    return !still && imgs.length > 1;
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

  function startAnim(target, fromValue, toValue, cb) {
    anim(target.style, trProp, unit, trTime * 1000, 0, 0, fromValue, toValue, ease, cb);
  }

  function endAnim() {
    if (onChangeEnd) {
      onChangeEnd(actualIndex, nextIndex());
    }
  }

  function remove(index) {
    removed = manageSlideOrder(removed, 1, imgs[index], 3);
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
    inserted = manageSlideOrder(inserted, 2, imgs[index], 4);
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
    clearTimeout(interval);

    imgs =
    containerElem =
    interval =
    trProp =
    trTime =
    delay =
    startVal =
    endVal =
    still =
    actualIndex =
    inserted =
    removed =
    remainingTime =
    onChange =
    onChangeEnd = null;
  }

  function currentIndex() {
    return actualIndex;
  }

  function anim(target, prop, unit, transitionDuration, startTime, elapsedTime, fromValue, toValue, easeFunc, cb) {
    var newValue;

    if (startTime > 0) {
      newValue = easeFunc(elapsedTime - startTime, fromValue, toValue - fromValue, transitionDuration);

      if (elapsedTime - startTime <= transitionDuration) {
        target[prop] = newValue + unit;
      } else {
        target[prop] = (toValue) + unit;

        if (cb) {
          cb();
          cb = null;
        }

        return;
      }
    }

    requestAnimationFrame(function requestAnimationFunction(time) {
      // Starts time in the first anim iteration
      if (startTime === 0) {
        startTime = time;
      }

      anim(target, prop, unit, transitionDuration, startTime, time, fromValue, toValue, easeFunc, cb);
    });
  }

  reset();

  if (imgs) {
    startInterval();
  }

  "#if TEST > 0"; // eslint-disable-line
  return {
    internalState: {
      getInterval: () => interval,
      getRemainingTime: () => remainingTime,
      getImgs: () => imgs,
      getContainerElem: () => containerElem,
      setActualIndex: val => { actualIndex = val; },
      setStartAnim: val => { startAnim = val; }, // eslint-disable-line no-func-assign
      startAnim,
      endAnim,
      reset,
      insert,
      remove,
      inserted,
      removed,
      trProp,
      trTime,
      delay,
      unit,
      startVal,
      visVal,
      endVal,
      still,
      ease
    },
    currentIndex,
    isAutoPlay,
    pause,
    resume,
    nextIndex,
    prevIndex,
    next,
    prev,
    change,
    dispose,
    onChange,
    onChangeEnd
  };
  "#else"; // eslint-disable-line
  return {
    currentIndex,
    isAutoPlay,
    pause,
    resume,
    nextIndex,
    prevIndex,
    next,
    prev,
    change,
    dispose,
    onChange,
    onChangeEnd
  };
  "#endif"; // eslint-disable-line
}

getSlider.defaultEase = function (time, begin, change, duration) {
  return ((time = time / (duration / 2)) < 1) // eslint-disable-line
    ? change / 2 * time * time * time + begin // eslint-disable-line
    : change / 2 * ((time -= 2) * time * time + 2) + begin; // eslint-disable-line
};

getSlider.easeNone = function (time, begin, change, duration) {
  return ((change * time) / duration) + begin;
};

export default getSlider;

