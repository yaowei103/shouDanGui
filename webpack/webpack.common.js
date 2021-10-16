const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const vConsolePlugin = require('vconsole-webpack-plugin'); // 页面打印

const {
  srcPath
} = require('./paths')

module.exports = {
  entry: {
    index: path.join(srcPath, 'index.tsx')
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        include: srcPath
      },
      // babel-loader
      {
        test: /\.(js|jsx)$/,
        loader: ['babel-loader?cacheDirectory'], // 开启缓存
        include: srcPath
        // exclude: /node_modules/
      },
      {
        oneOf: [
          {
            test: /\.css$/,
            loader: ['style-loader', 'css-loader', 'postcss-loader'] // 加了 postcss
          },
          {
            test: /\.less$/,
            exclude: /node_modules\.(css|less)/,
            use: [
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                  modules: true,
                },
              },
              {
                loader: require.resolve('less-loader'), // compiles Less to LESS
                options: {
                  importLoaders: 2,
                  modules: true,
                  getLocalIdent: (context, localIdentName, localName, options) => {
                    return `${localName}_${hash[8]}`;
                  },
                },
              },
            ],
          },

        ]
      },
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.css', '.scss', '.less'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(srcPath, 'index.html'),
      filename: 'index.html'
    }),
    new vConsolePlugin({
      enable: true
    })
  ]
}