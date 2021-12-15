"use strict";
exports.__esModule = true;
exports.provideConfiguration = exports.CommonPathPatterns_v1 = exports.SimpleWebPackConfig_v1_Paths_DEFAULT = void 0;
var path = require("path");
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
var extendDefaultPlugins = require("svgo").extendDefaultPlugins;
exports.SimpleWebPackConfig_v1_Paths_DEFAULT = {
    applicationEntryPointFile: "src/index.js",
    distributionDirectory: "dist",
    publicContentRoot: "."
};
exports.CommonPathPatterns_v1 = {
    fonts: /\.(woff2?|otf|ttf|eot)$/,
    documents: /\.(docx?|odt|pdf|xlsx?|txt|rtf)$/
};
function provideConfiguration(config, projectAbsoluteRootPath) {
    console.log(projectAbsoluteRootPath);
    if (!path.isAbsolute(projectAbsoluteRootPath)) {
        throw new Error("Project root path must be an absolute path.");
    }
    var evaluate = function (production) {
        var rules = [];
        var plugins = [];
        var minimizers = [];
        if (config.scripts.enabled) {
            var scriptsOnlyTest = /\.jsx?$/;
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
                    loader: "ts-loader"
                }
            });
        }
        if (config.styles.enabled) {
            var onlyStylesTest = /\.s?css$/;
            rules.push({
                test: onlyStylesTest,
                use: [
                    // creates style nodes from JS strings
                    {
                        loader: MiniCssExtractPlugin.loader
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
                            sourceMap: true
                        }
                    },
                    {
                        // compiles Sass to CSS, using Node Sass by default
                        loader: "sass-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                ]
            });
            if (config.styles.extract) {
                plugins.push(new MiniCssExtractPlugin({
                    filename: "[name].css",
                    chunkFilename: "[id].css"
                }));
            }
        }
        if (config.images.enabled) {
            // see https://webpack.js.org/guides/asset-modules
            // for those which are imported in stylesheets
            rules.push({
                test: /\.(png|gif|jpe?g|svg)$/,
                type: 'asset/resource'
            });
            // for those which are imported through javascript
            rules.push({
                test: /\.(png|gif|jpe?g|svg)$/,
                use: [{
                        loader: "file-loader",
                        options: { name: '[name].[ext]' }
                    }],
                dependency: {
                    not: ['url']
                }
            });
            if (config.images.optimize) {
                // Make sure that the plugin is after any plugins that add images, example `CopyWebpackPlugin`
                minimizers.push(new ImageMinimizerPlugin({
                    minimizer: {
                        implementation: ImageMinimizerPlugin.imageminMinify,
                        options: {
                            bail: false,
                            cache: true,
                            // Lossless optimization with custom option
                            // Feel free to experement with options for better result for you
                            plugins: [
                                ['gifsicle', { interlaced: true }],
                                ['mozjpeg', {
                                        progressive: true,
                                        quality: 75
                                    }],
                                ['optipng', { optimizationLevel: 5 }],
                                ['svgo', {
                                        plugins: extendDefaultPlugins([
                                            {
                                                name: 'removeViewBox',
                                                active: true
                                            },
                                        ])
                                    }],
                            ]
                        }
                    }
                }));
            }
        }
        if (config.copy.enabled) {
            rules.push({
                test: config.copy.pattern,
                use: [
                    {
                        loader: "file-loader",
                        options: { name: '[name].[ext]' }
                    }
                ],
                dependency: {
                    not: ['url']
                }
            });
        }
        return { rules: rules, plugins: plugins, minimizers: minimizers };
    };
    var absolutize = function (relative) {
        return path.resolve(projectAbsoluteRootPath, relative);
    };
    return function (env, options) {
        var isProduction = options.mode === 'production';
        var result = evaluate(isProduction);
        return {
            entry: absolutize(config.paths.applicationEntryPointFile),
            output: {
                path: absolutize(config.paths.distributionDirectory)
            },
            devtool: isProduction ? "source-map" : "inline-source-map",
            devServer: {
                static: [{
                        directory: absolutize(config.paths.publicContentRoot)
                    }]
            },
            module: {
                rules: result.rules
            },
            plugins: result.plugins,
            optimization: {
                minimizer: result.minimizers
            },
            resolve: {
                extensions: ['.ts', '.js', '.json', '.css', '.scss']
            }
        };
    };
}
exports.provideConfiguration = provideConfiguration;
