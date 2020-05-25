import path from 'path'
import webpack from 'webpack'
import cloudsYamlPath from './test/functional/helpers/cloudsYamlPath'

export default {
  entry: ['./src/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js-openstack-lib.js',
    library: 'JSOpenStackLib',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['transform-inline-environment-variables']
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/helpers\/cloudsConfig/,
      'json!yaml!' + cloudsYamlPath)
  ],
  node: {
    fs: 'empty'
  }
}
