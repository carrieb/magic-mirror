const path = require('path');
const webpack = require('webpack');
module.exports = [{
  context: path.join(__dirname, 'web'),
  entry: {
    mirror: 'mirror.js',
    receipts: 'receipts.js',
    kitchen: 'kitchen.js',
    recipes: 'recipes.js'
  },
  output: {
    path: path.join(__dirname, '/public/scripts'),
    filename: '[name]-bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.json$/,
        use: ['json-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [{
          loader: 'babel-loader',
          options: { presets: ['react', 'es2015']}
        }]
      }
    ]
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ],
  resolve: {
   extensions: ['.js', '.jsx'],
   modules: ['node_modules', path.join(__dirname, 'web')],
   alias: {
     src: path.join(__dirname, 'src'),
     components: path.join(__dirname, 'web', 'components'),
     styles: path.join(__dirname, 'public', 'styles'),
     state: path.join(__dirname, 'web', 'state')
   }
 }
}];
