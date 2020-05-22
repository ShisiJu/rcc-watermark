const path = require('path');

module.exports = {
  // entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/bundle.js'
  },
  devServer: {
    contentBase: './dist'
  },
  plugins: [
  ],
  module: {
    rules: [
      {
        test: /\.js$/, //using regex to tell babel exactly what files to transcompile
        exclude: /node_modules/, // files to be ignored
        use: {
          loader: 'babel-loader' // specify the loader
        }
      }
    ]
  }
}