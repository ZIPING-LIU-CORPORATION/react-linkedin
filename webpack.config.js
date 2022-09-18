// webpack.config.js
const path = require('path')
module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'liu.js'
  },
  devServer: {
    static: {       
      directory: path.resolve(__dirname, './dist')
    }
  },
	resolve: {
    extensions: ['.jsx', '.js'],
  },
	module: {
		rules: [
		{
			test: /\.(js)x?$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
			},
		},
	],
},
}