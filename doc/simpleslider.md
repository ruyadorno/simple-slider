# SimpleSlider

The SimpleSlider object basically holds references to the DOM elements to animate and the transition system.

Some useful methods are exposed to give developers more flexibility when working with the sliders.


## new SimpleSlider(container, options)

Constructor, creates a new SimpleSlider instance, using child elements of container as slides to be used.

### Example:

```js
    var options = { autoPlay: true };
    var slider = new SimpleSlider(document.getElementById('slider'), options);
```

Default **options** object values:

    {
      autoPlay: true,
      transitionProperty: 'left',
      transitionDuration: 0.5,
      transitionDelay: 3,
      startValue: -elem.width,
      visibleValue: 0,
      endValue: elem.width,
      ease: SimpleSlider.defaultEase
    }


## SimpleSlider.actualIndex

The index value on the slides list of the actual displaying slide.


## SimpleSlider.change(index)

Change displaying slides, it will perform the remove animation of the actual displaying slide and insert the slide that corresponds to the provided *index* value.

### Example:

```js
    var slider = new SimpleSlider(document.getElementById('slider'));

    // Jumps to third slide:
    slider.change(2);
```


## SimpleSlider.next()

Perform the remove animation of the actual displaying slide and insert the next one from the slide list.

### Example:

```js
    var slider = new SimpleSlider(document.getElementById('slider'));

    // Changes into next slide
    slider.next();
```


## SimpleSlider.prev()

Perform the remove animation of the actual displaying slide and insert the previous one from the slide list.

### Example:

```js
    var slider = new SimpleSlider(document.getElementById('slider'));

    // Changes into next slide
    slider.prev();
```


## SimpleSlider.prevIndex()

Gets the index value from the previous item on the list.


## SimpleSlider.nextIndex()

Gets the index value of the next item on the list.

## SimpleSlider.pauseAutoPlay()

Pauses the autoPlay *AKA slideshow* feature.

## SimpleSlider.resumeAutoPlay()

Resumes the autoPlay *AKA slideshow* feature.

## SimpleSlider.dispose()

Removes all internal objects and listeners

```js
    var slider = new SimpleSlider(document.getElementById('slider'));

    // Free memory used by slider
    slider.dispose();
```


## Ease functions

Two ease functions are available for simplifying the usage process of sliders.

### SimpleSlider.defaultEase

Default ease used by all created sliders, equivalent to [easeInOutCubic](https://github.com/danro/jquery-easing/blob/master/jquery.easing.js#L38).

### SimpleSlider.easeNone

Specifies no easing for the transition, give better results when using *fade* transitions.

### Examples:

```js
    // Create a slider with no transition easing
    var slider = new SimpleSlider(document.getElementById('slider'), {ease:SimpleSlider.easeNone});
```
