import * as webpack from "webpack";
import * as path from "path";

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ImageminPlugin = require("imagemin-webpack");

export interface SimpleWebPackConfig_v1_Paths {
	/**
	 * Relative path to entry point of your application.
	 * This file is dependency tree root of your application.
	 * (transitively references everything from your application)
	 * @default "src/index.js"
	 */
	applicationEntryPointFile: string,

	/**
	 * Relative path to where compiled files should be produced.
	 * @default "dist"
	 */
	distributionDirectory: string,

	/**
	 * Which directory is publicly accessible on production.
	 * Typically this folder where your index.html is.
	 * @default "."
	 */
	publicContentRoot: string,
}

export const SimpleWebPackConfig_v1_Paths_DEFAULT: SimpleWebPackConfig_v1_Paths = {
	applicationEntryPointFile: "src/index.js",
	distributionDirectory: "dist",
	publicContentRoot: "."
};


export const CommonPathPatterns_v1 = {
	fonts: /\.(woff2?|otf|ttf|eot)$/,
	documents: /\.(docx?|odt|pdf|xlsx?|txt|rtf)$/,
};
/**
 * Represents feature, which can be turned off or on.
 * And has configuration when enabled.
 */
type FeatureToggle_v1<T extends object> = {enabled: true} & T | {enabled: false}

export interface SimpleWebPackConfig_v1 {
	scripts:
		FeatureToggle_v1<{}>,
	styles: FeatureToggle_v1<{
		extract: boolean;
	}>,
	images: FeatureToggle_v1<{
		optimize: boolean
	}>,
	copy: FeatureToggle_v1<{
		/**
		 * Pattern used to mach files, which should be copied.
		 */
		pattern: RegExp | RegExp[]
	}>,
	paths: SimpleWebPackConfig_v1_Paths,
}

export function provideConfiguration(
	config: SimpleWebPackConfig_v1,
	projectAbsoluteRootPath: string
): (env: any, options: webpack.Configuration) => webpack.Configuration
{
	console.log(projectAbsoluteRootPath);
	if (!path.isAbsolute(projectAbsoluteRootPath)) {
		throw new Error("Project root path must be an absolute path.");
	}

	const evaluate = (production: boolean): {
		rules: webpack.RuleSetRule[],
		plugins: webpack.WebpackPluginInstance[]
	} => {
		const rules: webpack.RuleSetRule[] = [];
		const plugins: webpack.WebpackPluginInstance[] = [];

		if (config.scripts.enabled) {
			const scriptsOnlyTest = /\.jsx?$/;
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
			rules.push({
					test: /\.tsx?$/,
					exclude: /node_modules/,
					use: {
						loader: "ts-loader",
						// source maps are enabled by tsconfig.json from typescript/* directory
					},
				},
			);
		}

		if (config.styles.enabled) {
			const onlyStylesTest = /\.s?css$/;
			rules.push({
				test: onlyStylesTest,
				use: [
					// creates style nodes from JS strings
					{
						loader: MiniCssExtractPlugin.loader,
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
							sourceMap: true,
							postcssOptions: {
								plugins: [
									["postcss-preset-env"],
								]
							}
						}
					},
					{
						loader: 'resolve-url-loader',
						options: {
							sourceMap: true,
						},
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
				test: /\.(png|gif|jpe?g|svg)$/,
				type: 'asset/resource',
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
								['gifsicle', {interlaced: true}],
								['mozjpeg', {
									progressive: true,
									quality: 75,
								}],
								['optipng', {optimizationLevel: 5}],
								['svgo', {removeViewBox: true}],
							]
						}
					})
				);
			}
		}

		if (config.copy.enabled) {
			rules.push({
				test: config.copy.pattern,
				use: [
					{
						loader: "file-loader",
						options: {name: '[name].[ext]'}
					}
				],
			});
		}

		return { rules, plugins };
	};

	const absolutize = (relative: string): string =>
		path.resolve(projectAbsoluteRootPath, relative);

	return (env, options) => {
		const isProduction = options.mode === 'production';
		const result = evaluate(isProduction);

		return {
			entry: absolutize(config.paths.applicationEntryPointFile),
			output: {
				path: absolutize(config.paths.distributionDirectory),
			},
			devtool: isProduction ? "source-map" : "inline-source-map",
			devServer: {
				// The bundled files will be available in the browser under this path...
				publicPath: "/" + path.relative(
					absolutize(config.paths.publicContentRoot),
					absolutize(config.paths.distributionDirectory)
				),

				// Tell the server where to serve content from.
				contentBase: absolutize(config.paths.publicContentRoot),
			},
			module: {
				rules: result.rules
			},
			plugins: result.plugins,
			resolve: {
				extensions: ['.ts', '.js', '.json', '.css', '.scss'],
			}
		};
	};
}
