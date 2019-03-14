import {WebpackOptions, WebpackPluginFunction} from "webpack/declarations/WebpackOptions";

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageminPlugin = require("imagemin-webpack");

const imageminGifsicle = require("imagemin-gifsicle");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminOptipng = require("imagemin-optipng");
const imageminSvgo = require("imagemin-svgo");

const postcssPresetEnv = require('postcss-preset-env');

export interface SimpleWebPackConfig_v1 {
	scripts: {
		enabled: boolean,
	}
	styles: {
		enabled: boolean,
		extract: boolean;
	},
	images: {
		enabled: boolean,
		optimize: boolean,
	}
}

export function provideConfiguration(config: SimpleWebPackConfig_v1): WebpackOptions {
	let rules = [];
	let plugins = [];

	if (config.scripts.enabled) {
		rules.push({
			test: /\.js$/,
			exclude: /node_modules/,
			use: {
				loader: "babel-loader"
			}
		});
	}

	if (config.styles.enabled) {
		rules.push({
			test: /\.scss$/,
			use: [
				MiniCssExtractPlugin.loader, // creates style nodes from JS strings
				"css-loader", // translates CSS into CommonJS
				"sass-loader", // compiles Sass to CSS, using Node Sass by default
				{
					loader: 'postcss-loader',
					options: {
						ident: 'postcss',
						plugins: () => [
							postcssPresetEnv(/* pluginOptions */)
						]
					}
				},
			]
		});

		if (config.styles.extract) {
			plugins.push(
				new MiniCssExtractPlugin({
					filename: "[name].css",
					chunkFilename: "[id].css"
				})
			);
		}
	}



	if (config.images.enabled) {
		rules.push({
			test: /\.(png|jpe?g|svg)$/,
			use: [
				{
					loader: "file-loader",
					options: {name: '[name].[ext]'}
				}
			],
		});


		if (config.images.optimize) {
			// Make sure that the plugin is after any plugins that add images, example `CopyWebpackPlugin`
			new ImageminPlugin({
				bail: false, // Ignore errors on corrupted images
				cache: true,
				imageminOptions: {
					// Lossless optimization with custom option
					// Feel free to experement with options for better result for you
					plugins: [
						imageminGifsicle({
							interlaced: true
						}),
						imageminJpegtran({
							progressive: true
						}),
						imageminOptipng({
							optimizationLevel: 5
						}),
						imageminSvgo({
							removeViewBox: true
						})
					]
				}
			});
		}
	}

	return {
		module: {
			rules: rules
		},
		plugins: plugins
	};
}
