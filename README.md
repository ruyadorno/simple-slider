SimpleSlider
============

http://ruyadorno.github.com/SimpleSlider

version 0.0.1

A simple javascript slider without any dependencies on third-party libraries.

Bateries included

## Usage ##

Just import the script on html and make sure it's available before starting it.

```js
var slider = new SimpleSlider( document.getElementById('myslider') );
```

There are many usage examples on the examples folder, including all the available options for the slider.

## Contributing ##

You will need node.js and phantom.js in order to build and test the script. First of all get the required modules using npm:

```sh
npm install
```

The script uses yui compressor to generate the minified version. To be able to change the module code and recompile just npm install to get all dependencies. You can use the build command to generate the minified file after all the node modules are installed.

```sh
bin/build
```

Tests are using phantomjs and jasmine, to run it just invoke on terminal from the root folder:

```sh
bin/test
```

## License ##

Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php).
