const path = require('path');
const webpack = require('webpack');
module.exports = [{
  context: path.join(__dirname, 'web'),
  entry: {
    mirror: 'mirror.js'
  },
  output: {
    path: path.join(__dirname, '/public/scripts'),
    filename: '[name]-bundle.js'
  },
  module: {
    loaders: [
      {
        include: /\.json$/,
        loaders: ["json-loader"]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
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
