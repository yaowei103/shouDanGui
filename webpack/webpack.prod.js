const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HappyPack = require('happypack');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackCommonConf = require('./webpack.common.js');
const { srcPath, distPath } = require('./paths');

process.env.ENV = 'production';
const webRoot = '/shouDanGui/';

module.exports = merge(webpackCommonConf, {
  mode: 'production',
  output: {
    // filename: 'bundle.[contentHash:8].js',  // 打包代码时，加上 hash 戳
    filename: 'js/[name].[hash].js', // name 即多入口时 entry 的 key
    path: distPath,
    // publicPath: 'http://cdn.abc.com'  // 修改所有静态文件 url 的前缀（如 cdn 域名），这里暂时用不到
    publicPath: webRoot
  },
  module: {
    rules: [
      // 图片 - 考虑 base64 编码的情况
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            // 小于 5kb 的图片用 base64 格式产出
            // 否则，依然延用 file-loader 的形式，产出 url 格式
            limit: 5 * 1024,

            // 打包到 img 目录下
            outputPath: '/img1/',
          }
        }
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
    new CleanWebpackPlugin(), // 会默认清空 output.path 文件夹
    // new webpack.DefinePlugin({
    //   ENV: JSON.stringify('production'),
    //   WEB_ROOT: JSON.stringify(webRoot),
    // }),

    // happyPack 开启多进程打包
    new HappyPack({
      // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
      id: 'babel',
      // 如何处理 .js 文件，用法和 Loader 配置中一样
      loaders: ['babel-loader']
    }),

    // 使用 ParallelUglifyPlugin 并行压缩输出的 JS 代码
    // new ParallelUglifyPlugin({
    //   // 传递给 UglifyJS 的参数
    //   // （还是使用 UglifyJS 压缩，只不过帮助开启了多进程）
    //   uglifyJS: {
    //     output: {
    //       beautify: true, // 最紧凑的输出
    //       comments: false, // 删除所有的注释
    //     },
    //     compress: {
    //       // 删除所有的 `console` 语句，可以兼容ie浏览器
    //       drop_console: true,
    //       // 内嵌定义了但是只用到一次的变量
    //       collapse_vars: true,
    //       // 提取出出现多次但是没有定义成变量去引用的静态值
    //       reduce_vars: true,
    //     },
    //   }
    // })
  ],

  optimization: {
    //   // 压缩 css
    minimizer: [
      new TerserJSPlugin({}),
      new OptimizeCSSAssetsPlugin({})
    ],

    //   // 分割代码块
    splitChunks: {
      chunks: 'all',
      /**
      * initial 入口chunk，对于异步导入的文件不处理
        async 异步chunk，只对异步导入的文件处理
        all 全部chunk
      */

      // 缓存分组
      cacheGroups: {
        // 第三方模块
        vendor: {
          name: 'vendor', // chunk 名称
          priority: 1, // 权限更高，优先抽离
          test: /node_modules/,
          minSize: 0, // 大小限制
          minChunks: 1 // 最少复用过几次
        },

        // 公共的模块
        common: {
          name: 'common', // chunk 名称
          priority: 0, // 优先级
          minSize: 0, // 公共模块的大小限制
          minChunks: 1 // 公共模块最少复用过几次
        }
      }
    }
  }
});
