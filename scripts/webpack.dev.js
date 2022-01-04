const { WatchIgnorePlugin, DefinePlugin } = require('webpack');
const { resolve } = require('path');
const baseConfig = require('./base');

const root = (path) => resolve(__dirname, `../${path}`);

module.exports = {
  mode: 'development',
  entry: baseConfig.entry,
  output: {
    filename: '[name].js',
    path: root('dist/'),
    publicPath: '/',
    pathinfo: false
  },
  devtool: 'eval-cheap-module-source-map',
  module: {
    rules: [
      ...baseConfig.moduleRules,
      {
        test: /\.s[ac]ss$/i,
        include: root('src'),
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                mode: 'local',
                auto: true,
                localIdentName: '[path][name]__[local]'
              }
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        include: root('node_modules'),
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          }
        ]
      },
      {
        test: /\.(ttf|otf|eot|woff2?)(\?.+)?$/,
        include: root('src/assets'),
        use: {
          loader: 'file-loader'
        }
      }
    ]
  },
  optimization: {
    usedExports: true,
    splitChunks: {
      chunks: 'async',
      minChunks: 1,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/](?!(ace-builds|react-ace|xterm)).*.jsx?$/,
          name: 'vendor',
          priority: 10
        },
        common: {
          name: 'common',
          minChunks: 2,
          minSize: 30000
        }
      }
    }
  },
  resolve: baseConfig.resolve,
  plugins: [
    ...baseConfig.plugins,
    new WatchIgnorePlugin({
      paths: [
        root('node_modules'),
        root('server'),
        root('build'),
        root('dist')
      ] }),
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  devServer: {
    compress: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    host: '0.0.0.0',
    port: 8001
  }
};
