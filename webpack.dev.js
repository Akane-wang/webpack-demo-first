'use strict';

const path = require('path');
const { setMPA } = require('./utils');
const HTMLWebpackPlugin = require('html-webpack-plugin'); // 不用手动添加打包结果到index.html,webpack自动添加其置。
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

const { entry, htmlWebpackPlugin } = setMPA();
module.exports = {
    entry: entry,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name][chunkhash:8].js',
        clean: true
    },
    mode: 'development', // 'development' | 'production', wds需要在开发环境而非生产环境下
    optimization: {
        minimize: true, // 开发环境配置
        minimizer: [
            new CssMinimizerPlugin({
                minimizerOptions: {
                    preset: [
                        "default"
                    ]
                }
            }),
        ]
    },
    module: {
        rules: [
            // {
            //     test: '/\.txt$/',
            //     use: 'raw-loader'
            // },
            {
                test: /\.js$/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    // 'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    // 'style-loader',
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    require('autoprefixer')({
                                        overrideBrowserslist: ['last 2 version', '>1%', 'ios 7']// 指定需要兼容的浏览器版本 browser 替换成overrideBrowserslist；否则会报错
                                    })
                                ]
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'img/[name][hash:8].[ext]'
                    }
                }],
                // use: [
                //     {
                //         loader: 'url-loader',
                //         options: {
                //             limit: 10240
                //         }
                //     }
                // ]
            },
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({ template: './src/index.html'}),
        new MiniCssExtractPlugin({ // 提取css成独立的文件
            filename: '[name][contenthash:8].css'
        }),
        new webpack.HotModuleReplacementPlugin(),
        // new CleanWebpackPlugin(),
    ].concat(htmlWebpackPlugin),
    devServer: {
        static: {
            directory: path.join(__dirname, './dist'),
        },
        hot: true
    },
    stats: 'errors-only',
    devtool: 'cheap-source-map'
}