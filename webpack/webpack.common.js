const path = require('path');
const vConsolePlugin = require('vconsole-webpack-plugin'); // 页面打印
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
        loader: 'babel-loader', //, 'ts-loader'
        // include: srcPath,
        // exclude: /node_modules/
      },
      // babel-loader
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader', // 开启缓存
        include: srcPath
        // exclude: /node_modules/
      },
      {
        oneOf: [
          {
            test: /\.css$/,
            use: [
              MiniCssExtractPlugin.loader,
              // 'style-loader',
              'css-loader',
              // 'postcss-loader'
            ] // 加了 postcss
          },
          {
            test: /\.less$/,
            exclude: /node_modules\.(css|less)/,
            use: [
              MiniCssExtractPlugin.loader,
              // require.resolve('style-loader'),
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
    new vConsolePlugin({
      enable: true
    }),

    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, '../public/utils'), to: "utils/" },
      ],
    }),

  ]
}
