# Contributing

## Creating issues

### Bugs

If you happen to find a bug while using the script, go ahead and fill an issue. I'll only require that you provide the steps to reproduce the bug, browser/operating system along with their respective versions and the version of SimpleSlider that you're using.

### Suggesting improvements

I'm quite open to opinions, if you have any idea on how to improve the script feel free to open an issue. Just keep in mind the goal of the project, a simple slider functionality with no style involved.

## Fork, contributing with some code

**Please! Submit your PR to the develop branch!**

Feel free to fork the project and submit PRs. I'll just ask the usual, add some tests to demonstrate and ensures that your functionality work as expected and make sure that you run all tests and everything is working fine before submitting a pull request. **Just make sure that your PR is pointing to the develop branch before submitting it.**

Also, when you contribute a PR with new functionality or fixes, please do not include concatenated/minified versions and do not attempt to alter the version number on files, all those are taken care of in the automated `grunt release` task that a project maintainer will run later when a version is ready to be shipped.

### Setting up the project

You will need [node.js](http://nodejs.org/), [Grunt](gruntjs.com) and [PhantomJS](http://phantomjs.org/) in order to build and test the script. If you have all these dependcies you can just get the required packages for development using npm:

```sh
npm install
```

### Running the tests

Tests are using [PhantomJS](http://phantomjs.org/) and [Jasmine](http://jasmine.github.io/), to run tests against the current `src/simpleslider.js` file, simply execute the following grunt task:

```sh
grunt jasmine:dev
```

Running `grunt jasmine` will also run tests over the concatenated and minified versions, so keep in mind that you might need to generate those before running all the tests.

### Building the compiled version

The script uses [UglifyJS](http://lisperator.net/uglifyjs/) to generate the minified version.

You can use the grunt uglify task to generate the minified file after all the node modules are installed:

```sh
grunt uglify:dist
```

### Building the concatenated version

```sh
concat:dist
```

### Creating releases (maintainers only)

First of all, make sure you're in the `develop` branch and in a clean state.

```sh
git checkout develop
git st
```

The release script will prompt you for a version release number (please follow [semver](http://semver.org/)), make sure you know what the new version number will be before triggering the script. The script will also prompt a development version number, that can simply be an extra number at the end usually followed by the `-rc` suffix. Ex: `v0.5.2-rc` is the dev version after the `v0.5.1` release.

Once you're confident about what version number is going to be used for this release, just run:

```sh
grunt release
```

The script will correctly replace version numbers, create the concatenate and minified versions, commits, tags, and push it all to the official repo, make sure you have the required rights before running it.

