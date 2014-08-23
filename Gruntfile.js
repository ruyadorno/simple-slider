'use strict';

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-sg-release');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.initConfig({

    sg_release: {
      options: {
        skipBowerInstall: true,
        files: ['package.json', 'bower.json', 'README.md'],
        commitFiles: ['-a'],
        pushTo: 'origin master',
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
    'sg_release'
  ]);

};

