# simple-slider

[![NPM version](https://badge.fury.io/js/simple-slider.svg)](https://npmjs.org/package/simple-slider) [![Build Status](https://travis-ci.org/ruyadorno/simple-slider.svg?branch=master)](https://travis-ci.org/ruyadorno/simple-slider) ![File Size: < 1.2kB gzipped](https://badge-size.herokuapp.com/ruyadorno/simple-slider/master/dist/simpleslider.min.js?compression=gzip)

http://ruyadorno.github.com/simple-slider

A simple javascript carousel with zero dependencies.


## About

**simple-slider** is a simple image carousel based on the [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) API. It makes for a highly testable implementation and less css-dependent.

This package contains a framework agnostic implementation. If you are using **AngularJS** or **Polymer** there are some **simple-slider** framework-specific implementations available:

- [angular-simple-slider](https://github.com/ruyadorno/angular-simple-slider)
- [polymer-simple-slider](https://github.com/ruyadorno/polymer-simple-slider)


## Features

- Small size, less than 1.2kb minified/gzipped
- Support to [UMD](https://github.com/umdjs/umd): AMD, CommonJS and global definition
- Uses [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) for animations
- Supports [Page visibility API](https://developer.mozilla.org/en-US/docs/Web/Events/visibilitychange) to pause/resume transitions when user navigates away from the page
- Accept [ease functions](https://github.com/jimjeffers/Easie/blob/master/easie.js) to customize the transition animation
- Lots of ready-to-use examples available, just check the [example](./examples/) folder
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

Simply import the script on html and call the `simpleSlider` function. As a best practice you should always define width and height values to your container element.

```html
<div style="width:612px; height:612px" data-simple-slider>
  <img src="https://unsplash.it/612/612?random=1"/>
  <img src="https://unsplash.it/612/612?random=2"/>
</div>
<script src="simpleslider.min.js"></script>
<script>
  simpleSlider();
</script>
```

*In this previous example we didn't specified any additional option, in this case the slider will use its default left-to-right sliding animation and the container element will be the first element containing a `data-simple-slider` attribute.*

### Options

Options are set as named properties of a single parameter accepted by the `simpleSlider` function, they help you customize the slider transition and how it's going to work.

The main option is a `container` element, this will usually be a `<div>` or `<ul>` containing the elements to be transitioned. You can also tweak things such as the delay time between each transition, how long each transition will take, etc.

```html
<div id="myslider" style="width:612px; height:612px">
  <img src="https://unsplash.it/612/612?random=1"/>
  <img src="https://unsplash.it/612/612?random=2"/>
</div>
<script src="simpleslider.min.js"></script>
<script>
  simpleSlider({
    container: document.getElementById('myslider'),
    transitionTime:1,
    transitionDelay:3.5
  });
</script>
```


## Available Options

Here is the list of available values to customize how your slider is going to work:

- **container**: <[Element](https://developer.mozilla.org/en-US/docs/Web/API/Element)> The HTML element that act as a container for the slider. Defaults to `document.querySelector('*[data-simple-slider])`.
- **children** <[NodeList](https://developer.mozilla.org/en-US/docs/Web/API/NodeList)/Array> A list of children to be used as slides, you can use the [querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) to have more flexibility on what children of the `container` element should be used as slides. Defaults to `container.children`.
- **paused**: <Boolean> Controls carousel auto-transition/slideshow. If vaue is `true` no transition will happen. Defaults to `false`.
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
  var currentIndex;

  function updateCurrentIndex() {
    currentIndex = slider.currentIndex();
  }

  var slider = simpleSlider({
    container: document.getElementById('myslider'),
    onChangeEnd: updateCurrentIndex
  });

  // pauses slideshow
  slider.pause();
</script>
```

## Available methods:

- `currentIndex()` Returns the index of the current displaying image.
- `isAutoPlay()` Returns `true` if the carousel is in slideshow/auto-transition mode.
- `pause()` Pauses the slideshow.
- `resume()` Resumes the slideshow.
- `nextIndex()` Gets the index of the next slide to be shown.
- `prevIndex()` Gets the index of the previous slide.
- `next()` Switches displaying image to the next one.
- `prev()` Switches displaying image to the previous one.
- `change(index)` Changes image to a given `index` value.
- `dispose()` Disposes of all internal variable references.


## More examples

There are many more usage samples in the [examples](./examples/) folder, including all the available options for the slider.


## [Documentation](http://ruyadorno.github.io/simple-slider/doc/simpleslider_doc.html)

More documentation about the methods and properties of a can be found at the <a href="http://ruyadorno.github.io/simple-slider/doc/simpleslider_doc.html">simple-slider official documentation</a>.


## License

MIT © [Ruy Adorno](http://ruyadorno.com)

