const HtmlWebpackPlugin = require('html-webpack-plugin')
 
module.exports = {
  entry: 'app.js',
  output: {
    path: __dirname + '/dist',
    filename: 'app_bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin()
  ]
}