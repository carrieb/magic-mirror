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
        test: /\.scss$/,
        use: ['style-loader', 'css-loader?url=false', 'sass-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader?url=false']
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
     sass: path.join(__dirname, 'web', 'styles'),
     state: path.join(__dirname, 'web', 'state')
   }
 }
}];
