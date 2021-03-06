const { resolve } = require('path');
const autoprefixer = require('autoprefixer');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const WebpackBar = require('webpackbar');
const isDev = process.env.NODE_ENV === 'development';
const root = (path) => resolve(__dirname, `../${path}`);

module.exports = {
  entry: {
    main: './src/entries/index.tsx',
  },
  moduleRules: [
    {
      test: /\.tsx?$/,
      include: root('src'),
      use: [
        {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            plugins: isDev ? [require.resolve('react-refresh/babel')] : [],
          },
        },
      ],
    },
    {
      test: /\.(jpg|png|svg)(\?.+)?$/,
      include: root('src/assets'),
      type: 'asset',
      resourceQuery: /url/, // *.svg?url
    },
    {
      test: /\.svg$/i,
      issuer: [/\.[jt]sx?$/],
      use: [{ loader: '@svgr/webpack', options: { icon: true } }],
    },
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss', '.svg'],
    symlinks: false,
    modules: [root('src'), 'node_modules'],
  },
  plugins: [
    new WebpackAssetsManifest({
      entrypoints: true,
      writeToDisk: true,
      output: '../dist/manifest.json',
    }),
    new WebpackBar(),
  ],
  postcssOptions: {
    ident: 'postcss',
    plugins: () => [
      require('postcss-flexbugs-fixes'),
      autoprefixer(['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'], {
        flexbox: 'no-2009',
      }),
    ],
  },
};
