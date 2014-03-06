SimpleSlider
============

version: 0.1.0

[![Build Status](https://travis-ci.org/ruyadorno/SimpleSlider.png?branch=develop)](https://travis-ci.org/ruyadorno/SimpleSlider)

http://ruyadorno.github.com/SimpleSlider

A simple javascript slider without any dependencies on third-party libraries.


## About ##

The main goal of the project is to provide a flexible yet simple solution for the common slider/carousel/gallery functionality. It is important to note that the script does not take care of any styling, it is all up to the front-end developer to configure the css in a proper way, although many sample uses can be found in the example folder.

This package is also only supporting the simple javascript usage, I plan to wrap it around more high-level implementations in the near future, such as an AngularJS directive, Polymer element that can also include more styling by default.


## Usage ##

Just import the script on html and create a new slider instance.

Basically the slider takes the element that handles the gallery as the first parameter, this will be usually a *div* or *ul* containing the elements to be transitioned.

```html
<div id="myslider">
  <img src="http://placekitten.com/g/612/612"/>
  <img src="http://placekitten.com/g/612/613"/>
</div>
<script src="../src/simpleslider.js"></script>
<script>
  var slider = new SimpleSlider( document.getElementById('myslider') );
</script>
```

### Options

Options can be set to help you customize your slider, just set a second parameter specifying values such as duration of the transition, css property to be animated, etc.

```html
<div id="myslider">
  <img src="http://placekitten.com/g/612/612"/>
  <img src="http://placekitten.com/g/612/613"/>
</div>
<script src="../src/simpleslider.js"></script>
<script>
  var slider = new SimpleSlider( document.getElementById('myslider'), {
    autoPlay:false,
    transitionTime:1,
    transitionDelay:3.5
  } );
</script>
```


### More examples

There are many more usage samples in the examples folder, including all the available options for the slider.


## License ##

Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php).

