const { merge } = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const baseConfig = require('./base.config');
const { paths } = require('./vars');

const config = {
  mode: `${process.env.NODE_ENV}`,
  devtool: 'source-map',
  devServer: {
    contentBase: paths.output,
    historyApiFallback: true,
    compress: true,
    port: 9000,
  },
  output: {
    filename: '[name].[contenthash].js',
    publicPath: './',
  },
  optimization: {
    minimize: true,
    moduleIds: 'deterministic',
    chunkIds: 'deterministic',
    mangleWasmImports: true,
    mergeDuplicateChunks: true,
    innerGraph: true,
    realContentHash: true,
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 20000,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
    runtimeChunk: {
      name: 'manifest',
    },
    minimizer: [new UglifyJsPlugin(), new OptimizeCSSAssetsPlugin(), new TerserPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.styl|css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'stylus-loader'],
      },
    ],
  },
};

module.exports = merge(baseConfig, config);
