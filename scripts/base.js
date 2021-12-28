const { resolve } = require('path');
const WebpackAssetsManifest = require('webpack-assets-manifest');
// const isDev = process.env.NODE_ENV === 'development';
const root = (path) => resolve(__dirname, `../${path}`);

module.exports = {
  entry: {
    main: './src/entries/index.tsx'
  },
  moduleRules: [
    {
      test: /\.tsx?$/,
      include: root('src'),
      use: [
        {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      ]
    }
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    symlinks: false,
    modules: [root('src'), 'node_modules']
  },
  plugins: [
    new WebpackAssetsManifest({
      entrypoints: true,
      writeToDisk: true,
      output: '../dist/manifest.json'
    })
  ]
};
