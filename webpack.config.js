module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          }
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        },
      },
    ]
  },
  resolve: {
    extensions: ['.jsx', '.js', '.json']
  },
  externals: {
    'react': 'react', // Case matters here 
    'react-dom' : 'reactDOM' // Case matters here 
   }
}
