const { resolve } = require('path');
const { DefinePlugin } = require('webpack');

const root = (path) => resolve(__dirname, `../${path}`);

module.exports = {
  mode: 'production',
  entry: {
    server: './server/index.js',
  },
  output: {
    path: root('dist/'),
    publicPath: '/',
    filename: '[name].js',
    library: {
      type: 'commonjs',
    },
  },
  target: 'node',
  node: {
    // Need this when working with express, otherwise the build fails
    __dirname: false, // if you don't put this is, __dirname
    __filename: false, // and __filename return blank or /
  },
  optimization: {
    minimize: false,
  },
  externals: {
    webpack: 'webpack',
  }, // Need this to avoid error when working with Express
  module: {
    rules: [
      {
        test: /\.(yml|html|css|svg|properties|ttf|otf|eot|woff2?)(\?.+)?$/,
        type: 'asset/resource',
        generator: {
          filename: '[path][name].[ext]',
        },
      },
    ],
  },
  plugins: [
    new DefinePlugin({
      'process.env.BROWSER': false,
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
};
