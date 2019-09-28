'use strict';

function getdef(val, def) {
  return val == null ? def : val; // eslint-disable-line
}

function len(arr) {
  return (arr || []).length;
}

function startSlides(containerElem, children, unit, startVal, visVal, trProp) {
  let style,
    imgs = [];

  if (!children) {
    children = containerElem.children;
  }

  let i = len(children);

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
  let trProp = getdef(options.prop, 'left');
  let trTime = getdef(options.duration, 0.5) * 1000;
  let delay = getdef(options.delay, 3) * 1000;
  let unit = getdef(options.unit, '%');
  let startVal = getdef(options.init, -100);
  let visVal = getdef(options.show, 0);
  let endVal = getdef(options.end, 100);
  let paused = options.paused;
  let ease = getdef(options.ease, defaultEase);
  let onChange = getdef(options.onChange, 0);
  let onChangeEnd = getdef(options.onChangeEnd, 0);
  let now = Date.now;

  function reset() {
    if (len(containerElem.children) > 0) {
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
    intervalStartTime = now();
    interval = setTimeout(() => {
      intervalStartTime = now();
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
    return !paused && len(imgs) > 1;
  }

  function pause() {
    if (isAutoPlay()) {
      remainingTime = delay - (now() - intervalStartTime);
      clearTimeout(interval);
      interval = 0;
    }
  }

  function reverse() {
    const newEndVal = startVal;
    startVal = endVal;
    endVal = newEndVal;
    actualIndex = Math.abs(actualIndex - (len(imgs) - 1));
    imgs = imgs.reverse();
  }

  function change(newIndex) {
    let count = len(imgs);
    while (--count >= 0) {
      imgs[count].style.zIndex = 1;
    }

    imgs[newIndex].style.zIndex = 3;
    imgs[actualIndex].style.zIndex = 2;

    anim(
      imgs[actualIndex].style, // insertElem
      visVal, // insertFrom
      endVal, // insertTo
      imgs[newIndex].style, // removeElem
      startVal, // removeFrom
      visVal, // removeTo
      trTime, // transitionDuration
      0, // startTime
      0, // elapsedTime
      ease // easeFunc
    );

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
    const newIndex = actualIndex + 1;
    return newIndex >= len(imgs)
      ? 0
      : newIndex;
  }

  function prevIndex() {
    const newIndex = actualIndex - 1;
    return newIndex < 0
      ? len(imgs) - 1
      : newIndex;
  }

  function dispose() {
    clearTimeout(interval);
    document.removeEventListener('visibilitychange', visibilityChange);

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

  function anim(insertElem, insertFrom, insertTo, removeElem, removeFrom, removeTo, transitionDuration, startTime, elapsedTime, easeFunc) {
    function setProp(elem, from, to) {
      elem[trProp] =
        easeFunc(elapsedTime - startTime, from, to - from, transitionDuration) + unit;
    }

    if (startTime > 0) {
      if (elapsedTime - startTime < transitionDuration) {
        setProp(insertElem, insertFrom, insertTo);
        setProp(removeElem, removeFrom, removeTo);
      } else {
        insertElem[trProp] = insertTo + unit;
        removeElem[trProp] = removeTo + unit;

        if (onChangeEnd) {
          onChangeEnd(actualIndex, nextIndex());
        }

        return;
      }
    }

    requestAnimationFrame(time => {
      // Starts time in the first anim iteration
      if (startTime === 0) {
        startTime = time;
      }

      anim(
        insertElem,
        insertFrom,
        insertTo,
        removeElem,
        removeFrom,
        removeTo,
        transitionDuration,
        startTime,
        time,
        easeFunc
      );
    });
  }

  function visibilityChange() {
    if (document.hidden) {
      pause();
    } else {
      resume();
    }
  }

  // configures visibility api handler https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
  document.addEventListener('visibilitychange', visibilityChange);
  reset();

  if (len(imgs) > 1) {
    resume();
  }

  "#if TEST > 0"; // eslint-disable-line
  return {
    internalState: {
      getInterval: () => interval,
      getRemainingTime: () => remainingTime,
      getImgs: () => imgs,
      getContainerElem: () => containerElem,
      setActualIndex: val => { actualIndex = val; },
      isAutoPlay,
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

