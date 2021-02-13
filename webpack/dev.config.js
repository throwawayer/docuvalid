const { merge } = require('webpack-merge');
const baseConfig = require('./base.config');
const { paths } = require('./vars');

const config = {
  mode: `${process.env.NODE_ENV}`,
  devtool: 'source-map',
  devServer: {
    contentBase: paths.output,
    historyApiFallback: true,
    port: 3000,
  },
  output: {
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(styl|css)$/i,
        use: [
          'style-loader',
          'css-loader',
          'stylus-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['autoprefixer'],
              },
            },
          },
        ],
      },
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        loader: 'source-map-loader',
      },
    ],
  },
  resolve: {
    modules: ['node_modules'],
  },
};

module.exports = merge(baseConfig, config);
