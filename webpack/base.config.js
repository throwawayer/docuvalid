const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { paths } = require('./vars');

const isDevelopment = process.env.NODE_ENV === 'development';

const plugins = [
  new HtmlWebpackPlugin({
    template: path.resolve('index.html'),
    favicon: path.resolve('src', 'assets', 'images', 'favicon.ico'),
    filename: 'index.html',
    inject: true,
  }),
];

if (isDevelopment) {
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.LoaderOptionsPlugin({ debug: true }),
    new ReactRefreshWebpackPlugin(),
    new CleanWebpackPlugin.CleanWebpackPlugin(),
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: false,
      allowAsyncCycles: false,
      cwd: process.cwd(),
    }),
  );
} else {
  plugins.push(
    new webpack.LoaderOptionsPlugin({ minimize: true, debug: false }),
    new webpack.ids.HashedModuleIdsPlugin(),
    new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
    new webpack.ids.DeterministicModuleIdsPlugin({
      maxLength: 8,
    }),
  );
}

module.exports = {
  context: paths.root,
  resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
  entry: ['babel-polyfill', paths.entry],
  output: {
    path: paths.output,
    filename: 'bundle.js',
  },
  plugins,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /[\\/]node_modules[\\/]/,
        use: [
          {
            loader: 'babel-loader',
            options: { cacheDirectory: true, babelrc: true },
          },
        ],
      },
    ],
  },
};
