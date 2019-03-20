import * as webpack from "webpack";
import {SourceMapDevToolPluginOptions} from "webpack/declarations/plugins/SourceMapDevToolPlugin";

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

export function provideConfiguration(config: SimpleWebPackConfig_v1):
	(env: any, options: webpack.WebpackOptions) => webpack.WebpackOptions
{
	const evaluate = (production: boolean): {
		rules: webpack.WebpackOptions.module.rules,
		plugins: webpack.WebpackOptions.plugins
	} => {
		let rules = [];
		let plugins = [];

		if (config.scripts.enabled) {
			const scriptsOnlyTest = /\.js$/;
			rules.push({
				test: scriptsOnlyTest,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						sourceMap: true
					}
				}
			});
		}

		if (config.styles.enabled) {
			const onlyStylesTest = /\.s?css$/;
			rules.push({
				test: onlyStylesTest,
				use: [
					// creates style nodes from JS strings
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							sourceMap: true
						}
					},
					{
						// translates CSS into CommonJS
						loader: "css-loader",
						options: {
							importLoaders: 5,
							sourceMap: true
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							ident: 'postcss',
							sourceMap: true,
							plugins: () => [
								postcssPresetEnv(/* pluginOptions */)
							]
						}
					},
					{
						// compiles Sass to CSS, using Node Sass by default
						loader: "sass-loader",
						options: {
							sourceMap: true,
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
				plugins.push(
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
					})
				);
			}
		}

		return { rules, plugins };
	};
	return (env, options) => {
		const isProduction = options.mode === 'production';
		const result = evaluate(isProduction);
		return {
			devtool: isProduction ? "source-maps" : "inline-source-maps",
			module: {
				rules: result.rules
			},
			plugins: result.plugins
		};
	};
}
