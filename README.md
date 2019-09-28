# simple-slider

[![NPM version](https://badge.fury.io/js/simple-slider.svg)](https://npmjs.org/package/simple-slider)
[![CDNJS version](https://img.shields.io/cdnjs/v/simple-slider.svg)](https://cdnjs.com/libraries/simple-slider)
[![Build Status](https://travis-ci.org/ruyadorno/simple-slider.svg?branch=master)](https://travis-ci.org/ruyadorno/simple-slider)
![File Size: < 1.1kB gzipped](http://img.badgesize.io/ruyadorno/simple-slider/master/dist/simpleslider.min.js?compression=gzip)
[![license](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://raw.githubusercontent.com/ruyadorno/simple-slider/master/LICENSE)
[![Join the chat at https://gitter.im/simple-slider/Lobby](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/simple-slider/Lobby)

https://ruyadorno.github.com/simple-slider

Extremely lightweight carousel micro library.

[![Build Status](https://saucelabs.com/browser-matrix/ruyadorno-3.svg)](https://saucelabs.com/beta/builds/533bdd25630b4472a05f128b0c47e91f)

## About

**simple-slider** is a carousel micro library based on the [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) API. It makes for a highly testable implementation and less css-dependent.

This package contains a framework agnostic implementation. If you are using **AngularJS** or **Polymer** there are some **simple-slider** framework-specific implementations available:

- [angular-simple-slider](https://github.com/ruyadorno/angular-simple-slider)
- [polymer-simple-slider](https://github.com/ruyadorno/polymer-simple-slider)


## Features

- Small size, less than 1.1kb minified/gzipped
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

and you can also get it on **Bower**:

```sh
bower install --save simple-slider
```

### Getting it from cdnjs

This library is also available on https://cdnjs.com/ you can use it just by importing:

- Minified version: https://cdnjs.cloudflare.com/ajax/libs/simple-slider/1.0.0/simpleslider.min.js
- Unminified version: https://cdnjs.cloudflare.com/ajax/libs/simple-slider/1.0.0/simpleslider.js


## Usage

Simply import the script in your html and call the `simpleslider.getSlider` function.

```html
<div style="width:612px; height:612px" data-simple-slider>
  <img src="https://picsum.photos/612/612?random=1"/>
  <img src="https://picsum.photos/612/612?random=2"/>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/simple-slider/1.0.0/simpleslider.min.js"></script>
<script>
  simpleslider.getSlider();
</script>
```

*In this previous example we didn't specified any additional option, in this case the slider will use its default left-to-right sliding animation and the container element will be the first element containing a `data-simple-slider` attribute.*

### Usage in a CommonJS environment

```js
var simpleslider = require('simple-slider');

simpleslider.getSlider();
```

### ES2015+ environments

```js
import { getSlider } from 'simple-slider/src';

getSlider();
```

### RequireJS/AMD environment

```js
require(['simple-slider'], function(simpleslider) {
  simpleslider.getSlider();
});
```


## Options

Options are set as named properties of a single parameter accepted by the `getSlider` function, they help you customize the slider transition and how it's going to work.

The main option is a `container` element, this will usually be a `<div>` or `<ul>` containing the elements to be transitioned, keep in mind that this container should also have a defined width/height value. You can also tweak things such as the delay time between each transition, how long each transition will take, etc.

```html
<div id="myslider" style="width:612px; height:612px">
  <img src="https://picsum.photos/612/612?random=1"/>
  <img src="https://picsum.photos/612/612?random=2"/>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/simple-slider/1.0.0/simpleslider.min.js"></script>
<script>
  simpleslider.getSlider({
    container: document.getElementById('myslider'),
    transitionTime:1,
    delay:3.5
  });
</script>
```

### Available Options

Here is the list of available values to customize how your slider is going to work:

- **container**: <[Element](https://developer.mozilla.org/en-US/docs/Web/API/Element)> The HTML element that act as a container for the slider. Defaults to `document.querySelector('*[data-simple-slider])`.
- **children** <[NodeList](https://developer.mozilla.org/en-US/docs/Web/API/NodeList)/Array> A list of children to be used as slides, you can use the [querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) to have more flexibility on what children of the `container` element should be used as slides. Defaults to `container.children`.
- **paused**: <Boolean> Controls carousel auto-transition/slideshow. If value is `true` no transition will happen. Defaults to `false`.
- **prop**: <String> Determines the css property to be animated. Defaults to `left`.
- **duration**: <Number> Value setting the duration of animation transition. Defaults to `0.5`.
- **delay**: <Number> Value determining the wait between each animation when auto-transition is enabled. Defaults to `3` seconds.
- **init**: <String/Number> Initial value of slide elements when starting a transition animation. Defaults to `-100`.
- **show**: <String/Number> The value a slide element should have when it is displayed. Defaults to `0`.
- **end**: <String/Number> The value a slide will move to during a transition animation. Defaults to `100`.
- **unit**: <String> The css unit value to be used. Defaults to `%`.
- **ease**: <Function> An ease function, you can use any of [these](https://github.com/jimjeffers/Easie/blob/master/easie.js). Defaults to `defaultEase` internal function.
- **onChange**: <Function> A callback function to be invoked each time a slide changes.
- **onChangeEnd**: <Function> A callback function to be invoked at the end of the slide transition

### Default values

```js
{
  container: document.querySelector('*[data-simple-slider]'),
  children: container.children,
  paused: false,
  prop: 'left',
  duration: 0.5,
  delay: 3,
  init: -100,
  show: 0,
  end: 100,
  unit: '%',
  ease: defaultEase function,
  onChange: undefined,
  onChangeEnd: undefined
}
```


## Programmatic API

Some methods are exposed by the returning value of the function allowing you to control the slider.

```html
<div id="myslider" style="width:612px; height:612px">
  <img src="http://placekitten.com/g/612/612"/>
  <img src="http://placekitten.com/g/612/613"/>
</div>
<script src="../dist/simpleslider.min.js"></script>
<script>
  var currentIndex;

  function updateCurrentIndex() {
    currentIndex = slider.currentIndex();
  }

  var slider = simpleslider.getSlider({
    container: document.getElementById('myslider'),
    onChangeEnd: updateCurrentIndex
  });

  // pauses slideshow
  slider.pause();
</script>
```

### Available methods:

- `currentIndex()` Returns the index of the current displaying image.
- `pause()` Pauses the slideshow.
- `resume()` Resumes the slideshow.
- `reverse()` Swaps `init` for `end` and reverses the order of slides.
- `nextIndex()` Gets the index of the next slide to be shown.
- `prevIndex()` Gets the index of the previous slide.
- `next()` Switches displaying image to the next one.
- `prev()` Switches displaying image to the previous one.
- `change(index)` Changes image to a given `index` value.
- `dispose()` Disposes of all internal variable references.


## More examples

- [Responsive layout example](./examples/responsive-layout-example.html)
- [Default slider with no options](./examples/no-options.html)
- [Default slider with options](./examples/default-sliding-transition.html)
- [Fading/Opacity transition](./examples/fading-transition.html)
- [Full page transition](./examples/full-page-transition.html)
- [Lightbox integrated](./examples/lightbox-integrated-example.html)
- [Mask sliding transition](./examples/mask-sliding-transition.html)
- [Pause slide](./examples/pause-slide-change-example.html)
- [RequireJS usage](./examples/requirejs-example.html)
- [Reverse sliding direction](./examples/reverse-sliding-direction-example.html)
- [Right to left sliding transition](./examples/right-to-left-sliding-transition.html)
- [Slides containing no images](./examples/text-content-example.html)
- [Top to bottom transition](./examples/top-to-bottom-sliding-transition.html)
- [Touch swipe example](./examples/touch-swipe-example.html)
- [Custom ease animation](./examples/custom-ease-animation-example.html)


## [Documentation](https://ruyadorno.github.io/simple-slider/docs/)

Extensive documentation of the options and methods can be found at the [simple-slider official documentation](https://ruyadorno.github.io/simple-slider/docs/).


## Alternatives

A JavaScript carousel micro library is not a new thing (fun fact, **simple-slider** has been around [since 2013](https://github.com/ruyadorno/simple-slider/commit/1e54f82536e5e1ef047445ab705c674cff3db9ee)).

I would recommend that you take a look at some of the available alternatives and decide by yourself which one better suits your needs.

- [slick](https://github.com/kenwheeler/slick)
- [lory](https://github.com/meandmax/lory)
- [siema](https://pawelgrzybek.com/siema/)
- [Swiper](https://github.com/nolimits4web/Swiper)
- [iSlider](https://github.com/BE-FE/iSlider)
- [Owl Carousel](https://github.com/OwlCarousel2/OwlCarousel2)
- [flickity](https://github.com/metafizzy/flickity)
- [swipe](https://github.com/lyfeyaj/swipe)
- [unslider](https://github.com/idiot/unslider)
- [Glide](https://github.com/jedrzejchalubek/glidejs)


## License

MIT © [Ruy Adorno](http://ruyadorno.com)

