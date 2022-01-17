const { resolve } = require('path');
const merge = require('lodash/merge');
const { DefinePlugin } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const root = (path) => resolve(__dirname, `../${path}`);

const baseConfig = require('./base');

const smp = new SpeedMeasurePlugin();

const config = {
  mode: 'production',
  entry: baseConfig.entry,
  output: {
    filename: '[name].[chunkhash].js',
    path: root('dist/'),
    publicPath: '/dist/',
    chunkFilename: '[id].[chunkhash].js',
  },
  module: {
    rules: [
      ...baseConfig.moduleRules,
      {
        test: /\.s[ac]ss$/i,
        include: root('src'),
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: {
                mode: 'local',
                auto: true,
                localIdentName: '[path][name]__[local]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: baseConfig.postcssOptions,
            },
          },
          { loader: 'sass-loader' },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        include: root('node_modules'),
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: baseConfig.postcssOptions,
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(ttf|otf|eot|woff2?)(\?.+)?$/,
        include: root('src/assets'),
        type: 'asset/resource',
        generator: {
          filename: '/assets/[hash][ext][query]',
        },
      },
    ],
  },
  optimization: {
    chunkIds: 'total-size',
    moduleIds: 'size',
    concatenateModules: true,
    flagIncludedChunks: true,
    usedExports: true,
    minimize: true,
    sideEffects: true,
    minimizer: [
      new CssMinimizerPlugin({
        test: /\.css$/g,
        minimizerOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
      }),
    ],
    splitChunks: {
      chunks: 'async',
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 5,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/](?!(ace-builds|react-ace|xterm)).*.jsx?$/,
          name: 'vendor',
          priority: 10,
        },
        common: {
          name: 'common',
          minChunks: 2,
          minSize: 30000,
        },
      },
    },
  },
  resolve: merge({}, baseConfig.resolve, {
    alias: { lodash: root('node_modules/lodash') },
  }),
  plugins: [
    ...baseConfig.plugins,
    new CopyPlugin({
      patterns: [{ from: root('src/assets'), to: root('dist/assets') }],
    }),
    new DefinePlugin({
      'process.env.BROWSER': true,
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new BundleAnalyzerPlugin({ analyzerMode: 'static' }),
  ],
};

const swpConfig = smp.wrap(config);
swpConfig.plugins.push(
  new MiniCssExtractPlugin({
    filename: '[name].[chunkhash].css',
    chunkFilename: '[id].[chunkhash].css',
  })
);

module.exports = [swpConfig];
