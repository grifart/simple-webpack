"use strict";
exports.__esModule = true;
var path = require("path");
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var ImageminPlugin = require("imagemin-webpack");
var imageminGifsicle = require("imagemin-gifsicle");
var imageminJpegtran = require("imagemin-jpegtran");
var imageminOptipng = require("imagemin-optipng");
var imageminSvgo = require("imagemin-svgo");
var postcssPresetEnv = require('postcss-preset-env');
exports.SimpleWebPackConfig_v1_Paths_DEFAULT = {
    applicationEntryPointFile: "src/index.js",
    distributionDirectory: "dist",
    publicContentRoot: "."
};
function provideConfiguration(config, projectAbsoluteRootPath) {
    console.log(projectAbsoluteRootPath);
    if (!path.isAbsolute(projectAbsoluteRootPath)) {
        throw new Error("Project root path must be an absolute path.");
    }
    var evaluate = function (production) {
        var rules = [];
        var plugins = [];
        if (config.scripts.enabled) {
            var scriptsOnlyTest = /\.js$/;
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
                            plugins: function () { return [
                                postcssPresetEnv( /* pluginOptions */)
                            ]; }
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
            rules.push({
                test: /\.(png|jpe?g|svg)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: { name: '[name].[ext]' }
                    }
                ]
            });
            if (config.images.optimize) {
                // Make sure that the plugin is after any plugins that add images, example `CopyWebpackPlugin`
                plugins.push(new ImageminPlugin({
                    bail: false,
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
                }));
            }
        }
        rules.push({
            test: /\.(woff2?|ttf|eot)$/,
            use: [
                {
                    loader: "file-loader",
                    options: { name: '[name].[ext]' }
                }
            ]
        });
        return { rules: rules, plugins: plugins };
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
                // The bundled files will be available in the browser under this path...
                publicPath: "/" + path.relative(absolutize(config.paths.publicContentRoot), absolutize(config.paths.distributionDirectory)),
                // Tell the server where to serve content from.
                contentBase: absolutize(config.paths.publicContentRoot)
            },
            module: {
                rules: result.rules
            },
            plugins: result.plugins
        };
    };
}
exports.provideConfiguration = provideConfiguration;
