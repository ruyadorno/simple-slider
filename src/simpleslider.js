'use strict';

function getdef(val, def) {
  return val == null ? def : val; // eslint-disable-line
}

function startSlides(containerElem, children, unit, startVal, visVal, trProp) {
  let style,
    imgs = [];

  if (!children) {
    children = containerElem.children;
  }

  let i = children.length;

  while (--i >= 0) {
    imgs[i] = children[i];
    style = imgs[i].style;
    style.position = 'absolute';
    style.top =
    style.left =
    style.zIndex = 0;
    style[trProp] = startVal + unit;
  }

  style[trProp] = visVal + unit;
  style.zIndex = 1;

  return imgs;
}

function defaultEase(time, begin, change, duration) {
  return ((time = time / (duration / 2)) < 1) // eslint-disable-line
    ? change / 2 * time * time * time + begin // eslint-disable-line
    : change / 2 * ((time -= 2) * time * time + 2) + begin; // eslint-disable-line
}

function getSlider(options) {
  options = options || {};
  let actualIndex, interval, intervalStartTime, imgs, remainingTime;

  // Get user defined options or its default values
  let containerElem = getdef(options.container, document.querySelector('*[data-simple-slider]'));
  let trProp = getdef(options.transitionProperty, 'left');
  let trTime = getdef(options.transitionDuration, 0.5);
  let delay = getdef(options.transitionDelay, 3) * 1000;
  let unit = getdef(options.unit, '%');
  let startVal = getdef(options.startValue, -100);
  let visVal = getdef(options.visibleValue, 0);
  let endVal = getdef(options.endValue, 100);
  let paused = options.paused; // eslint-disable-line
  let ease = getdef(options.ease, defaultEase);
  let onChange = getdef(options.onChange, null);
  let onChangeEnd = getdef(options.onChangeEnd, null);

  function reset() {
    if (containerElem.children.length > 0) {
      let style = containerElem.style;
      style.position = 'relative';
      style.overflow = 'hidden';
      style.display = 'block';

      imgs = startSlides(containerElem, options.children, unit, startVal, visVal, trProp);
      actualIndex = 0;
      remainingTime = delay;
    }
  }

  // Slideshow/autoPlay timing logic
  function setAutoPlayLoop() {
    intervalStartTime = Date.now();
    interval = setTimeout(() => {
      intervalStartTime = Date.now();
      remainingTime = delay; // resets time, used by pause/resume logic

      change(nextIndex());

      // loops
      setAutoPlayLoop();
    }, remainingTime);
  }

  function resume() {
    if (isAutoPlay()) {
      if (interval) {
        clearTimeout(interval);
      }

      setAutoPlayLoop();
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

  function reverse() {
    const newEndVal = startVal;
    startVal = endVal;
    endVal = newEndVal;
    actualIndex = Math.abs(actualIndex - (imgs.length - 1));
    imgs = imgs.reverse();
  }

  function change(newIndex) {
    let count = imgs.length;
    while (--count >= 0) {
      imgs[count].style.zIndex = 1;
    }

    imgs[newIndex].style.zIndex = 3;
    imgs[actualIndex].style.zIndex = 2;

    anim([
      {
        elem: imgs[actualIndex].style,
        from: visVal,
        to: endVal
      },
      {
        elem: imgs[newIndex].style,
        from: startVal,
        to: visVal
      }
    ], trTime * 1000, 0, 0, ease);

    actualIndex = newIndex;

    if (onChange) {
      onChange(prevIndex(), actualIndex);
    }
  }

  function next() {
    change(nextIndex());
    resume();
  }

  function prev() {
    change(prevIndex());
    resume();
  }

  function nextIndex() {
    let newIndex = actualIndex + 1;
    return newIndex >= imgs.length
      ? 0
      : newIndex;
  }

  function prevIndex() {
    const newIndex = actualIndex - 1;
    return newIndex < 0
      ? imgs.length - 1
      : newIndex;
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
    paused =
    actualIndex =
    remainingTime =
    onChange =
    onChangeEnd = null;
  }

  function currentIndex() {
    return actualIndex;
  }

  function anim(targets, transitionDuration, startTime, elapsedTime, easeFunc) {
    let count = targets.length;

    while (--count >= 0) {
      let target = targets[count];
      let newValue;
      if (startTime > 0) {
        newValue = easeFunc(elapsedTime - startTime, target.from, target.to - target.from, transitionDuration);

        if (elapsedTime - startTime < transitionDuration) {
          target.elem[trProp] = newValue + unit;
        } else {
          // sets all target elements to their final position
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

    requestAnimationFrame(time => {
      // Starts time in the first anim iteration
      if (startTime === 0) {
        startTime = time;
      }

      anim(targets, transitionDuration, startTime, time, easeFunc);
    });
  }

  reset();

  if (imgs && imgs.length > 1) {
    resume();
  }

  // configures visibility api handler https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      pause();
    } else {
      resume();
    }
  });

  "#if TEST > 0"; // eslint-disable-line
  return {
    internalState: {
      getInterval: () => interval,
      getRemainingTime: () => remainingTime,
      getImgs: () => imgs,
      getContainerElem: () => containerElem,
      setActualIndex: val => { actualIndex = val; },
      defaultEase,
      reset,
      trProp,
      trTime,
      delay,
      unit,
      startVal,
      visVal,
      endVal,
      paused,
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
    reverse,
    dispose
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
    reverse,
    dispose
  };
  "#endif"; // eslint-disable-line
}

export {getSlider};

