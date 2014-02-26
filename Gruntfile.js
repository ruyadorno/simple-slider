'use strict';

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

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
    },

    uglify: {
      options: {
        mangle: false,
        compress: {
          warnings: true
        }
      },
      dist: {
        src: 'src/simpleslider.js',
        dest: 'dist/simpleslider.min.js'
      }
    },

    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['src/simpleslider.js'],
        dest: 'dist/simpleslider.js',
      },
    },

  });

  grunt.registerTask('release', [
    'uglify:dist',
    'concat:dist',
    'bump'
  ]);

};

