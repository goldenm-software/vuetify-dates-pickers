const { join } = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const basicConfig = require('./webpack.base.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

const resolve = dir => join(__dirname, '..', dir)

module.exports = merge(basicConfig, {
  mode: 'development',
  entry: {
    app: './dev/main.js'
  },
  watchOptions: {
    ignored: [
      /node_modules/
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: resolve('static'),
    compress: false,
    hot: true,
    inline: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new VuetifyLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'dev/index.html',
      inject: true,
      title: 'devices Demo'
    })
  ]
})
