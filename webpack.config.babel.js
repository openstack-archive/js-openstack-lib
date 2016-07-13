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
        exclude: /node_modules/
      }
    ]
  }
};
