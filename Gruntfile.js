'use strict';

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-menu');
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
        pushTo: 'origin',
      }
    },

    jasmine: {
      options: {
        specs: ['test/unit-tests.js', 'test/functional-tests.js']
      },
      dev: {
        src: 'src/simpleslider.js',
      },
      concat: {
        src: 'dist/simpleslider.js',
      },
      minified: {
        src: 'dist/simpleslider.min.js',
      },
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
    'jasmine:dev',
    'uglify:dist',
    'concat:dist',
    'jasmine:concat',
    'jasmine:minified',
    'sg_release'
  ]);

  grunt.registerTask('default', ['menu']);

};

