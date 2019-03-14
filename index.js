"use strict";
exports.__esModule = true;
var webpack = require("webpack");
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var ImageminPlugin = require("imagemin-webpack");
var imageminGifsicle = require("imagemin-gifsicle");
var imageminJpegtran = require("imagemin-jpegtran");
var imageminOptipng = require("imagemin-optipng");
var imageminSvgo = require("imagemin-svgo");
var postcssPresetEnv = require('postcss-preset-env');
function provideConfiguration(config) {
    var evaluate = function (production) {
        var rules = [];
        var plugins = [];
        if (config.scripts.enabled) {
            var scriptsOnlyTest = /\.js$/;
            rules.push({
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            });
            plugins.push(production
                ? new webpack.SourceMapDevToolPlugin({
                    test: scriptsOnlyTest,
                    filename: production ? "[name].js.map" : null
                })
                : new webpack.EvalSourceMapDevToolPlugin({
                    test: scriptsOnlyTest
                }));
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
            plugins.push(new webpack.SourceMapDevToolPlugin({
                test: onlyStylesTest,
                filename: "[name].css.map"
            }));
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
                new ImageminPlugin({
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
                });
            }
        }
        return { rules: rules, plugins: plugins };
    };
    return function (env, options) {
        var result = evaluate(options.mode === 'production');
        return {
            devtool: false,
            module: {
                rules: result.rules
            },
            plugins: result.plugins
        };
    };
}
exports.provideConfiguration = provideConfiguration;
