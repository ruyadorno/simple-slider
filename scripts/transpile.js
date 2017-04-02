'use strict';

const babel = require('babel-core');
const fs = require('fs');
const path = require('path');

babel.transformFile('src/simpleslider.js', {
  presets: ['env'],
  plugins: [
    ['transform-es2015-modules-umd'],
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
  const filename = path.join(__dirname, '..', 'dist', 'simpleslider.js');
  fs.writeFileSync(filename, result.code);
});

