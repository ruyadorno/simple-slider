# simple-slider

[![NPM version](https://badge.fury.io/js/simple-slider.svg)](https://npmjs.org/package/simple-slider) [![Build Status](https://travis-ci.org/ruyadorno/simple-slider.svg?branch=master)](https://travis-ci.org/ruyadorno/simple-slider) ![File Size: < 1.2kB gzipped](https://badge-size.herokuapp.com/ruyadorno/simple-slider/master/dist/simpleslider.min.js?compression=gzip)

http://ruyadorno.github.com/simple-slider

A simple javascript carousel with zero dependencies.


## About

**simple-slider** is a simple image carousel based on the [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) API. It makes for a highly testable implementation and less css-dependent.

This package contains a framework agnostic implementation. If you are using frameworks like **AngularJS** or **Polymer** please check the following **simple-slider** framework-specific implementations:

- [angular-simple-slider](https://github.com/ruyadorno/angular-simple-slider)
- [polymer-simple-slider](https://github.com/ruyadorno/polymer-simple-slider)

### Yet another zero dependency carousel implementation?

:smile: Yes but this one has been around [since 2013](https://github.com/ruyadorno/simple-slider/commit/1e54f82536e5e1ef047445ab705c674cff3db9ee)


## Features

- Small footprint, less than 1.2kb minified/gzipped
- Support to [UMD](https://github.com/umdjs/umd): AMD, CommonJS and global definition
- Uses [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) and its polyfills for animation
- Supports [Page visibility API](https://developer.mozilla.org/en-US/docs/Web/Events/visibilitychange) to pause/resume autoPlay when user navigates away from the page
- Accept [ease functions](https://github.com/jimjeffers/Easie/blob/master/easie.js) to customize the transition animation
- Lots of examples, just check the [example](./examples/) folder
- Animates any numerical css property


## Install

Available on **npm**:

```sh
npm install --save simple-slider
```

or you can also get it on **Bower**:

```sh
bower install --save simple-slider
```


## Usage

Import the script on html and create a new slider instance. As a best practice you should always have to define width and height values to your container element.

The slider takes an `element` that handles the gallery as the first parameter, this will be usually a `<div>` or `<ul>` containing the elements to be transitioned.

```html
<div id="myslider" style="width:612px; height:612px">
  <img src="http://placekitten.com/g/612/612"/>
  <img src="http://placekitten.com/g/612/613"/>
</div>
<script src="simpleslider.min.js"></script>
<script>
  simpleSlider( document.getElementById('myslider') );
</script>
```

*In this previous example we didn't specified any additional option, in this case the slider will use its default left-to-right sliding animation.*

### Options

Options can be set to help you customize your slider, just set a second parameter specifying values such as duration of the transition, css property to be animated, etc.

```html
<div id="myslider" style="width:612px; height:612px">
  <img src="http://placekitten.com/g/612/612"/>
  <img src="http://placekitten.com/g/612/613"/>
</div>
<script src="simpleslider.min.js"></script>
<script>
  simpleSlider( document.getElementById('myslider'), {
    transitionTime:1,
    transitionDelay:3.5
  } );
</script>
```


## Available Options

Here is the list of available values to use on the constructor and customize your animation:

- **paused**: <Boolean> Controls carousel auto-transition. If vaue is `true` than no transition will happen. Defaults to `false`.
- **transitionProperty**: <String> Determines the css property to be animated. Defaults to `left`.
- **transitionDuration**: <Number> Value setting the duration of animation transition. Defaults to `0.5`.
- **transitionDelay**: <Number> Value determining the wait between each animation when auto-transition is enabled. Defaults to `3` seconds.
- **startValue**: <String/Number> Initial value of slide elements when starting a transition animation. Defaults to `<image width value> * -1`.
- **visibleValue**: <String/Number> The value a slide element should have when it is displayed. Defaults to `0px`.
- **endValue**: <String/Number> The value a slide will move to during a transition animation. Defaults to `<image width value>`.
- **unit**: <String> The css unit value to be used. Defaults to `px`.
- **ease**: <Function> An ease function, you can use any of [these](https://github.com/jimjeffers/Easie/blob/master/easie.js). Defaults to `simpleSlider.defaultEase`.
- **onChange**: <Function> A callback function to be invoked each time a slide changes.
- **onChangeEnd**: <Function> A callback function to be invoked at the end of the slide transition

### Default values

```js
{
  paused: false,
  transitionProperty: 'left',
  transitionDuration: 0.5,
  transitionDelay: 3,
  startValue: -elem.width,
  visibleValue: 0,
  endValue: elem.width,
  unit: 'px',
  ease: simpleSlider.defaultEase,
  onChange: null,
  onChangeEnd: null
}
```

## API

Some methods are exposed by the returning value of the function allowying programatic control of the carousel.

```html
<div id="myslider" style="width:612px; height:612px">
  <img src="http://placekitten.com/g/612/612"/>
  <img src="http://placekitten.com/g/612/613"/>
</div>
<div id="current">0</div>
<script src="../dist/simpleslider.min.js"></script>
<script>
  var slider = simpleslider.default( document.getElementById('myslider') );
  var currentIndex = slider.currentIndex();

  // pauses slideshow
  slider.pause();
</script>
```

## Available methods:

- `currentIndex()` Returns the index of the current displaying image
- `isAutoPlay()` Returns `true` if the carousel is in slideshow/auto-transition mode
- `pause()` Pauses the slideshow
- `resume()` Resumes the slideshow
- `nextIndex()` Gets the index of the next slide to be shown
- `prevIndex()` Gets the index of the previous slide
- `next()` Switches displaying image to the next one
- `prev()` Switches displaying image to the previous one
- `change(index)` Changes image to a given `index` value
- `dispose()` Disposes of all internal assignments, frees memory for gc


### More examples

There are many more usage samples in the [examples](./examples/) folder, including all the available options for the slider.


## [Documentation](http://ruyadorno.github.io/simple-slider/doc/simpleslider_doc.html)

More documentation about the methods and properties of a can be found at the <a href="http://ruyadorno.github.io/simple-slider/doc/simpleslider_doc.html">simple-slider official documentation</a>.


## License

MIT © [Ruy Adorno](http://ruyadorno.com)

