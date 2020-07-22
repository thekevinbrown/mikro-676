// We use require in this JS file, and 'tis fine.
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { IgnorePlugin } = require('webpack');

// Anything Knex is packaging can be ignored if it's not on disk.
// Later we check these dynamically and tell webpack to ignore the ones we don't have.
const optionalModules = new Set(Object.keys(require('knex/package.json').browser));

module.exports = {
	entry: path.resolve('src', 'index.ts'),
	mode: 'development',
	// mode: 'production',
	optimization: {
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					// We want to minify the bundle, but don't want Terser to change the names of our entity
					// classes. This can be controlled in a more granular way if needed, (see
					// https://terser.org/docs/api-reference.html#mangle-options) but the safest default
					// config is that we simply disable mangling altogether but allow minification to proceed.
					mangle: false,
				},
			}),
		],
	},
	target: 'node',
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				loader: 'ts-loader',
			},
			{
				test: /\.node$/,
				use: 'node-loader',
			},
			{
				test: /\.mjs$/,
				include: /node_modules/,
				type: 'javascript/auto',
			},
		],
	},
	externals: {
		// AWS SDK is already available on Lambda.
		'aws-sdk': 'aws-sdk',
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},

	plugins: [
		new IgnorePlugin({
			checkResource: resource => {
				const [baseResource] = resource.split('/');

				if (optionalModules.has(baseResource)) {
					try {
						require.resolve(resource);
						return false;
					} catch {
						return true;
					}
				}
				return false;
			},
		}),
	],

	output: {
		path: path.resolve('./dist'),
		filename: 'index.js',
		libraryTarget: 'commonjs2',
	},
};
