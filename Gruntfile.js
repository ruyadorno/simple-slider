'use strict';

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.initConfig({

    bump: {
      options: {
        files: ['package.json', 'bower.json', 'README.md'],
        updateConfigs: [],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['-a'], // '-a' for all files
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin master',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
      }
    },

    jasmine: {
      src: 'src/**/*.js',
      options: {
        specs: 'test/*Spec.js'
      }
    }

  });

  grunt.registerTask('release', [
    'bump'
  ]);

};

