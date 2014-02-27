# Contributing

## Creating issues

### Bugs

If you happen to find a bug while using the script, go ahead and fill an issue. I'll only require that you provide the steps to reproduce the bug, browser/operating system along with their respective versions and the version of SimpleSlider that you're using.

### Suggesting improvements

I'm quite open to opinions, if you have any idea on how to improve the script feel free to open an issue. Just keep in mind the goal of the project, a simple slider functionality with no style involved.

## Fork, contributing with some code

Feel free to fork the project and submit PRs. I'll just ask the usual, add some tests to demonstrate and ensures that your functionality work as expected and make sure that you run all tests and everything is working fine before submitting a pull request.

### Setting up the project

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

