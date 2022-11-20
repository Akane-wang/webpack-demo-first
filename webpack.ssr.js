'use strict';

const path = require('path');
const { setMPA } = require('./utils');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // webpack@5压缩

// const CleanWebpackPlugin = require('clean-webpack-plugin');
// const webpack = require('webpack');
// const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
// const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const { entry, htmlWebpackPlugins } = setMPA(true);

module.exports = {
    entry: entry,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]-server.js',
        clean: true, // 打包时自动清理dist目录
        library: {
           type: 'umd' 
        },
        globalObject: 'this', // umd下的构建在浏览器和nodejs皆可用
        publicPath: ''
    },
    mode: 'production', // 'development' | 'production', wds需要在开发环境而非生产环境下; production默认开启tree-shaking
    optimization: {
        minimize: false, // 开发环境配置
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
                    // 'eslint-loader'
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
                            remPrecision: 8, // px转成rem时小数点的位数
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name][hash:8].[ext]', // ext: 后缀
                        outputPath: 'img',
                        esModule: false, // 服务端渲染时，不应该使用es模块语法，因此需要关闭掉
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
    ].concat(htmlWebpackPlugins),
    stats: 'errors-only',
}