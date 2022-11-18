'use strict';

const { setMPA } = require('./utils');
const path = require('path');
// const HTMLWebpackPlugin = require('html-webpack-plugin'); // 不用手动添加打包结果到index.html,webpack自动添加其置。
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin'); // webpack@4
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // webpack@5压缩

// const CleanWebpackPlugin = require('clean-webpack-plugin');
// const webpack = require('webpack');

const { entry, htmlWebpackPlugin } = setMPA();
module.exports = {
    entry: entry,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name][hash:8].js',
        clean: true // 打包时自动清理dist目录
    },
    mode: 'production', // 'development' | 'production', wds需要在开发环境而非生产环境下; production默认开启tree-shaking
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
        ],

        // 资源分离
        splitChunks: {
            chunks: 'all', // async(异步引入的库分离，默认) | initial （同步引入的库分离） | all（所有引入的库分离，推荐）
            cacheGroups: {
                commons: {
                    test: /(react|react-dom)/,
                    name: 'vendors',
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    'babel-loader',
                    'eslint-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    // {
                    //     loader: 'style-loader',
                        // options: {
                        //     insert: 'head', // 样式插入到<head>
                        //     injectType: 'singletonStyleTag', // 将所有的style标签合并成一个
                        // }
                    // },
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    // {
                        // loader: 'style-loader',
                        // options: {
                        //     insert: 'head', // 样式插入到<head>
                        //     injectType: 'singletonStyleTag', // 将所有的style标签合并成一个
                        // }
                    // },
                    MiniCssExtractPlugin.loader, // 'style-loader', // 与mini-css-extract-plugin不能共存, style-loader替换成MiniCssExtractPlugin.loader,
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
                    },
                    {
                        loader: 'px2rem-loader',
                        options: {
                            remUnit: 75, // 1rem = 75px
                            remPrecision: 8 // px转成rem时小数点的位数
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'img/[name][hash:8].[ext]' // ext: 后缀
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
        new MiniCssExtractPlugin({ // 提取css成独立的文件
            filename: '[name][contenthash:8].css'
        }),

        // new CleanWebpackPlugin(),
        // new OptimizeCssAssetsWebpackPlugin({ // webpack4
        //     assetNameRegExp: /\.css$/g,
        //     cssProcessor: require('cssnano')
        // })
        // new webpack.HotModuleReplacementPlugin(),
    ].concat(htmlWebpackPlugin),
    stats: 'errors-only',
}