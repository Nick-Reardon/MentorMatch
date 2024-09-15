import { resolve as _resolve } from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import { __dirname } from './server/utils/globals.js';

export default {
  entry: [
    './client/index.js'
  ],
  output: {
    path: _resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  mode: 'development',
  devServer: {
    port: 8080,
    open: true,
    historyApiFallback: true,
    proxy: [
      {
        context: ['/api/**'],
        target: 'http://localhost:3000/',
      },
      {
        context: ['/auth/**'],
        target: 'http://localhost:3000/',
      }
    ] 
  },
  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-transform-runtime']
          }
        },
      },
      {
        test: /\.(svg|ico|png|webp|jpg|gif|jpeg)$/,
        type: 'asset/resource',
      },
      {
        test: /.(css|scss)$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/index.html',
    }),
    new ImageMinimizerPlugin({
      minimizerOptions: {
        // Lossless optimization with custom option
        // Feel free to experiment with options for better result for you
        plugins: [
          ['gifsicle', { interlaced: true }],
          ['jpegtran', { progressive: true }],
          ['optipng', { optimizationLevel: 5 }],
        ],
      },
    }),
  ],
  resolve: {
    // Enable importing JS / JSX files without specifying their extension
    extensions: ['.js', '.jsx'],
    fullySpecified: false
  }
};
