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

You will need [node.js](http://nodejs.org/), [Grunt](gruntjs.com) and [PhantomJS](http://phantomjs.org/) in order to build and test the script. If you have all these dependcies you can just get the required packages for development using npm:

```sh
npm install
```

### Running the tests

Tests are using [PhantomJS](http://phantomjs.org/) and [Jasmine](http://jasmine.github.io/), to run them simply execute the following grunt task:

```sh
grunt jasmine
```

### Building the compiled version

The script uses [UglifyJS](http://lisperator.net/uglifyjs/) to generate the minified version.

You can use the grunt uglify task to generate the minified file after all the node modules are installed:

```sh
grunt uglify:dist
```


## License ##

Released under the [MIT License](http://www.opensource.org/licenses/mit-license.php).

