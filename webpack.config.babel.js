import webpack from 'webpack';
import cloudsYamlPath from './test/functional/helpers/cloudsYamlPath';

export default {
  entry: ['./src/index.js'],
  output: {
    path: './dist',
    filename: 'js-openstack-lib.js',
    library: 'JSOpenStackLib',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          plugins: ['transform-inline-environment-variables']
        }
      }
    ]
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/helpers\/cloudsConfig/,
      'json!yaml!' + cloudsYamlPath)
  ]
};
