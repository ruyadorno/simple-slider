# Contributing

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

