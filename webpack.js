const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  // context: resolve(__dirname, 'app/'),
  entry: resolve(__dirname, 'app/Root.js'),
  output: {
    path: resolve(__dirname, '../dist/'),
    publicPath: '/',
    filename: '[name].[hash].js',
    sourceMapFilename: '[name].[hash].map',
    chunkFilename: '[name].[id].[hash].js'
  },
  mode: 'development',
  devtool: 'eval-source-map',
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
              ],
            }
          },
        ]
      },
      {
        test: /\.(s*)css$/,
        use:[
          {
            loader: 'style-loader',
          },
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/',
              hmr: devMode,
              sourceMap: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            }
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require("sass"),
              sourceMap: true,
              data: '@import \'./assets/scss/global-variables.scss\';',
            }
          },
        ],
      },
      {
        test   : /\.(ttf|eot|svg|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader : 'file-loader?name=fonts/[name].[ext]'
      }
    ]
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[hash].css',
    }),
    new HtmlWebpackPlugin({
      title: 'App Init',
      template: 'template.html',
      chunksSortMode: 'none'
    }),
  ],
  devServer: {
    disableHostCheck: true,
    clientLogLevel: "info",
    host: '0.0.0.0',
    port: 3000,
    contentBase: resolve(__dirname, './dist/'),
    publicPath: '/',
    historyApiFallback: true,
    stats: {
      modules: false,
      chunks: false,
      chunckModules: false,
      timings: true,
      warnigns: false,
      colors: true,
    },
  },
  performance: {
    hints: false
  },
}
