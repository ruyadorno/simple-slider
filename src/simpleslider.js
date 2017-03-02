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
      unit = item
        .replace(String(parseInt(item, 10)), '');
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
    console.warn(
      'A SimpleSlider main container element' +
      'should have at least one child.'
    );

    return true;
  }

  return false;
}

function startSlides(containerElem, unit, startVal, visVal, trProp) { // eslint-disable-line max-params
  const imgs = [];
  let i = containerElem.children.length;
  let style;

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
  let actualIndex, hasVisibilityHandler, inserted, interval, intervalStartTime, imgs, remainingTime, removed; // eslint-disable-line one-var
  let width = parseInt(containerElem.style.width || containerElem.offsetWidth, 10);

  // Get user defined options or its default values
  let trProp = getdef(options.transitionProperty, 'left');
  let trTime = getdef(options.transitionDuration, 0.5);
  let delay = getdef(options.transitionDelay, 3) * 1000;
  let unit = getUnit([options.startValue, options.visibleValue, options.endValue], trProp);
  let startVal = parseInt(getdef(options.startValue, -width + unit), 10);
  let visVal = parseInt(getdef(options.visibleValue, '0' + unit), 10);
  let endVal = parseInt(getdef(options.endValue, width + unit), 10);
  let autoPlay = getdef(parseStringToBoolean(options.autoPlay), true);
  let ease = getdef(options.ease, getSlider.defaultEase);
  let onChange = getdef(options.onChange, null);
  let onChangeEnd = getdef(options.onChangeEnd, null);

  function reset() {
    if (testChildrenNum(containerElem.children.length)) {
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

    // Slideshow/autoPlay timing logic
    (function setAutoPlayLoop() {
      intervalStartTime = Date.now();
      interval = window.setTimeout(() => {
        intervalStartTime = Date.now();
        remainingTime = delay; // resets time, used by pause/resume logic

        change(nextIndex());

        // loops
        setAutoPlayLoop();
      }, remainingTime);
    })();

    // Handles user leaving/activating the current page/tab
    if (!hasVisibilityHandler) {
      window.document.addEventListener('visibilitychange', updateVisibility, false);

      // only assign handler once
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

    imgs =
    containerElem =
    interval =
    trProp =
    trTime =
    delay =
    startVal =
    endVal =
    autoPlay =
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

  function anim(target, prop, unit, transitionDuration, startTime, elapsedTime, fromValue, toValue, easeFunc, cb) { // eslint-disable-line max-params
    function loop(_cb) {
      window.requestAnimationFrame(function requestAnimationFunction(time) {
        // Starts time in the first anim iteration
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
        target[prop] = (toValue) + unit;

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
      configSlideshow,
      inserted,
      removed,
      trProp,
      trTime,
      delay,
      unit,
      startVal,
      visVal,
      endVal,
      autoPlay,
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

