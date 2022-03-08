const { join } = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const resolve = dir => join(__dirname, '..', dir)

module.exports = {
  output: {
    filename: 'bundle.js',
    path: resolve('dist'),
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(css)$/,
        loader: 'vue-style-loader!css-loader'
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'vue-style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader'
        ]
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      {
        enforce: 'pre',
        test: /\.vue$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [new CleanWebpackPlugin(), new VueLoaderPlugin()],
  resolve: {
    extensions: ['.js', '.vue', '.json', '.css', '.less', '.styl'],
    modules: [resolve('src'), 'node_modules'],
    alias: {
      '@': resolve('src'),
      $dev: resolve('dev')
    }
  }
}
