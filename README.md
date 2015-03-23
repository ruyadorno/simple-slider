SimpleSlider
============

version: 0.5.2

[![Build Status](https://travis-ci.org/ruyadorno/SimpleSlider.png?branch=develop)](https://travis-ci.org/ruyadorno/SimpleSlider)

http://ruyadorno.github.com/SimpleSlider

A simple javascript slider without any dependencies on third-party libraries.


## About

The main goal of the project is to provide a flexible yet simple solution for the common slider/carousel/gallery functionality. It is important to note that the script does not want to take care of any styling but the minimal in order to have a functional slider. It is all up to the front-end developer to configure its css in a proper way. To help with that, many sample uses are provided in the [example](https://github.com/ruyadorno/SimpleSlider/tree/master/examples) folder.

This package only supports the Javascript basic usage. If you are using modern frameworks like **AngularJS** or **Polymer** please take your time to check the following **SimpleSlider** element implementations:

- [angular-simple-slider](https://github.com/ruyadorno/angular-simple-slider)
- [polymer-simple-slider](https://github.com/ruyadorno/polymer-simple-slider)


## Features

- Support to [UMD](https://github.com/umdjs/umd): AMD, CommonJS and global definition
- Uses [requireAnimationFrame](https://developer.mozilla.org/en/docs/Web/API/window.requestAnimationFrame) and its polyfills for animation
- Supports [Page visibility API](https://developer.mozilla.org/en-US/docs/Web/Events/visibilitychange) to pause/resume autoPlay when user navigates away from the page
- Accept [ease functions](https://github.com/jimjeffers/Easie/blob/master/easie.js) to customize the transition animation
- Lots of examples, just check the [example](https://github.com/ruyadorno/SimpleSlider/tree/master/examples) folder included on this repo
- Animates any numerical css property
- Support to ie9 and partially *ie8 (only position animations, no fading out animations for old ies)*


## Usage

Just import the script on html and create a new slider instance. You always have to define width and height values to your container element.

Basically the slider takes the element that handles the gallery as the first parameter, this will be usually a *div* or *ul* containing the elements to be transitioned.

```html
<div id="myslider" style="width:612px; height:612px">
  <img src="http://placekitten.com/g/612/612"/>
  <img src="http://placekitten.com/g/612/613"/>
</div>
<script src="simpleslider.min.js"></script>
<script>
  var slider = new SimpleSlider( document.getElementById('myslider') );
</script>
```

*In this previous example we did not specified any addition option, so the slider will use its default left-to-right sliding animation.*

### Options

Options can be set to help you customize your slider, just set a second parameter specifying values such as duration of the transition, css property to be animated, etc.

```html
<div id="myslider" style="width:612px; height:612px">
  <img src="http://placekitten.com/g/612/612"/>
  <img src="http://placekitten.com/g/612/613"/>
</div>
<script src="simpleslider.min.js"></script>
<script>
  var slider = new SimpleSlider( document.getElementById('myslider'), {
    autoPlay:false,
    transitionTime:1,
    transitionDelay:3.5
  } );
</script>
```


## Available Options

Here is the list of available values to use on the constructor and customize your animation:

- **autoPlay**: <Boolean> Value determining if the slide transition should happen automatically
- **transitionProperty**: <String> Determines the css property to be animated
- **transitionDuration**: <Number> Value setting the duration of animation transition
- **transitionDelay**: <Number> Value determining the wait between each animation when you use **autoPlay:true**
- **startValue**: <String/Number> Initial value of slide elements when starting a transition animation
- **visibleValue**: <String/Number> The value a slide element should have when it is displayed
- **endValue**: <String/Number> The value a slide will move to during a transition animation
- **ease**: <Function> An ease function, you can use any of [these](https://github.com/jimjeffers/Easie/blob/master/easie.js)
- **onChange**: <Function> A callback function to be invoked each time a slide changes

### Default values

    {
      autoPlay: true,
      transitionProperty: 'left',
      transitionDuration: 0.5,
      transitionDelay: 3,
      startValue: -elem.width,
      visibleValue: 0,
      endValue: elem.width,
      ease: SimpleSlider.defaultEase,
      onChange: null
    }

### More examples

There are many more usage samples in the [examples](https://github.com/ruyadorno/SimpleSlider/tree/master/examples) folder, including all the available options for the slider.


## [Documentation](http://ruyadorno.github.io/SimpleSlider/doc/simpleslider_doc.html)

More documentation about the methods and properties of a can be found at the <a href="http://ruyadorno.github.io/SimpleSlider/doc/simpleslider_doc.html">SimpleSlider official documentation</a>.


## License

Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php).

