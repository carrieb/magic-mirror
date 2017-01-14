const path = require('path');
module.exports = [{
  context: path.join(__dirname, 'web'),
  entry: {
    index: 'index-entry.js'
  },
  output: {
    path: path.join(__dirname, '/public/scripts'),
    filename: 'bundle.js'
  },
  loaders: [
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    }
  ],
  resolve: {
   extensions: ['', '.js', '.jsx'],
   root: [path.join(__dirname, 'web')],
   modulesDirectories: ['node_modules'],
   alias: {
     src: path.join(__dirname, 'src')
   }
 }
}];
