# simple-slider

The simple-slider object basically holds references to the DOM elements to animate and the transition system.

Some useful methods are exposed to give developers more flexibility when working with the sliders.


## simpleSlider(container, options)

Constructor, creates a new simple-slider object, using child elements of container as slides to be used.

### Example:

```js
    var slider = getSlider(document.getElementById('slider'), {});
```

Default **options** object values:

    {
      still: false,
      transitionProperty: 'left',
      transitionDuration: 0.5,
      transitionDelay: 3,
      startValue: -elem.width,
      visibleValue: 0,
      endValue: elem.width,
      ease: getSlider.defaultEase,
      onChange: null,
      onChangeEnd: null
    }


## simpleSlider.actualIndex

The index value on the slides list of the actual displaying slide.


## simpleSlider.onChange(prevIndex, nextIndex)

A callback function to be defined by the user. This function will be called everytime a slide changes and will contain two arguments, the first one is the index value of the previous active slide and the second is the index value of the next slide to be inserted.


## simpleSlider.onChangeEnd(currentIndex, nextIndex)

A callback function to be defined by the user. Called everytime the animation transition is completed, it has the current displaying slide index value and the next slide index value passed as parameters.


## simpleSlider.change(index)

Change displaying slides, it will perform the remove animation of the actual displaying slide and insert the slide that corresponds to the provided *index* value.

### Example:

```js
    var slider = simpleSlider(document.getElementById('slider'));

    // Jumps to third slide:
    slider.change(2);
```


## simpleSlider.next()

Perform the remove animation of the actual displaying slide and insert the next one from the slide list.

### Example:

```js
    var slider = simpleSlider(document.getElementById('slider'));

    // Changes into next slide
    slider.next();
```


## simpleSlider.prev()

Perform the remove animation of the actual displaying slide and insert the previous one from the slide list.

### Example:

```js
    var slider = simpleSlider(document.getElementById('slider'));

    // Changes into next slide
    slider.prev();
```


## simpleSlider.prevIndex()

Gets the index value from the previous item on the list.


## simpleSlider.nextIndex()

Gets the index value of the next item on the list.

## simpleSlider.pause()

Pauses the autoPlay *AKA slideshow* feature.

## simpleSlider.resume()

Resumes the autoPlay *AKA slideshow* feature.

## simpleSlider.dispose()

Removes all internal objects and listeners

```js
    var slider = simpleSlider(document.getElementById('slider'));

    // Free memory used by slider
    slider.dispose();
```


## Ease functions

Two ease functions are available for simplifying the usage process of sliders.

### simpleSlider.defaultEase

Default ease used by all created sliders, equivalent to [easeInOutCubic](https://github.com/danro/jquery-easing/blob/master/jquery.easing.js#L38).

### simpleSlider.easeNone

Specifies no easing for the transition, give better results when using *fade* transitions.

### Examples:

```js
    // Create a slider with no transition easing
    var slider = simpleSlider(document.getElementById('slider'), {ease:simpleSlider.easeNone});
```

