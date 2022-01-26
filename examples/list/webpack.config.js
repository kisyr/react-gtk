const path = require('path');
const webpack = require('webpack');

module.exports = {
	entry: path.resolve(__dirname, 'index.js'),
	module: {
		rules: [
			{
				test: /\.js?$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [ '@babel/preset-env', '@babel/preset-react' ]
					}
				}
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: process.env.NODE_ENV,
				DEBUG_REACT_GTK: '1'
			}
		})
	],
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'app.js'
	},
	optimization: {
		minimize: false
	}
};
