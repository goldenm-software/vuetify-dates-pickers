const { join } = require('path')
const merge = require('webpack-merge')
const basicConfig = require('./webpack.base.config')

const resolve = dir => join(__dirname, '..', dir)

module.exports = merge(basicConfig, {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    app: './src/index.js'
  },
  output: {
    path: resolve('build'),
    filename: 'index.js',
    library: 'LayrzDevicesModule',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: {
    'date-fns': 'date-fns'
  }
})
