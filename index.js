"use strict";
exports.__esModule = true;
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var ImageminPlugin = require("imagemin-webpack");
var imageminGifsicle = require("imagemin-gifsicle");
var imageminJpegtran = require("imagemin-jpegtran");
var imageminOptipng = require("imagemin-optipng");
var imageminSvgo = require("imagemin-svgo");
function provideConfiguration(config) {
    var rules = [];
    var plugins = [];
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
                MiniCssExtractPlugin.loader,
                "css-loader",
                "sass-loader" // compiles Sass to CSS, using Node Sass by default
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
    // compose webpack config
    return {
        module: {
            rules: rules
        },
        plugins: plugins
    };
}
exports.provideConfiguration = provideConfiguration;
