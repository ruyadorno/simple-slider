const path = require('path');

module.exports = {
  entry: {
    'unit-tests': './test/unit-tests.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '__tests__')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
            plugins: [
              ['conditional-compilation', {
                TEST: 1
              }]
            ]
          }
        }
      }
    ]
  }
};

