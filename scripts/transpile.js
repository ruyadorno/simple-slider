'use strict';

const babel = require('babel-core');

babel.transformFile('src/simpleslider.js', {
  plugins: [
    ['conditional-compilation', {
      TEST: 0
    }],
    ['remove-comments']
  ]
}, (err, result) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(result.code);
});

