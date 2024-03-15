const path = require('path');

module.exports = {
  entry: './src/index.js', 
  output: {
    filename: 'bundle.js', 
    path: path.resolve(__dirname, 'dist'), 
  },
  mode: 'development',
  performance: {
    maxEntrypointSize: 2000000, 
    maxAssetSize: 2000000, 
  },
};
