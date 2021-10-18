const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackCommonConf = require('./webpack.common.js');
const {
  merge
} = require('webpack-merge');
const {
  srcPath,
  distPath
} = require('./paths');
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');
const vConsolePlugin = require('vconsole-webpack-plugin'); // 页面打印
const HtmlWebpackPlugin = require('html-webpack-plugin');

process.env.ENV = 'development';

module.exports = merge(webpackCommonConf, {
  mode: 'development',
  entry: {
    index: path.join(srcPath, 'index.tsx')
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'file-loader'
      },
    ]
  },

  plugins: [
    // 抽离 css 文件
    new MiniCssExtractPlugin({
      filename: 'css/main.[name].[hash].css'
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      filename: 'index.html',
      publicPath: process.env.ENV === 'development' ? '/' : '/shouDanGui/'
    }),
    // new webpack.DefinePlugin({
    //   ENV: JSON.stringify('development'),
    //   WEB_ROOT: JSON.stringify('/')
    // }),
    new HotModuleReplacementPlugin(),
    new vConsolePlugin({
      enable: true
    })
  ],
  devServer: {
    port: 3000,
    allowedHosts: 'all',
    // open: true, // 自动打开浏览器
    compress: true, // 启动 gzip 压缩
    hot: true,
    historyApiFallback: true,
    // 设置代理
    // proxy: {
    //   // 将本地 /api/xxx 代理到 localhost:3000/api/xxx
    //   '/api': 'http://localhost:3000',

    //   // 将本地 /api2/xxx 代理到 localhost:3000/xxx
    //   '/api2': {
    //     target: 'http://localhost:3000',
    //     pathRewrite: {
    //       '/api2': ''
    //     }
    //   }
    // }
  }
});
