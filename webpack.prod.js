'use strict';

const { setMPA } = require('./utils');
const glob = require('glob');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin'); // webpack@4
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // webpack@5压缩
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

const smp = new SpeedMeasurePlugin();
// const CleanWebpackPlugin = require('clean-webpack-plugin');
// const webpack = require('webpack');

const MyPlugin = require('./plugins/my-plugin');
const ZipPlugin = require('./plugins/zip-plugin');

const { entry, htmlWebpackPlugins } = setMPA();
const TerserPlugin = require('terser-webpack-plugin');

// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
// const PurgeCssPlugin = require('purgecss-webpack-plugin'); // 过滤掉不用的css
const PATHS = {
    src: path.join(__dirname, 'src')
};

const prodConfig = {
    cache: true,
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
            new TerserPlugin({
                parallel: false
            })
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
    // 模块查找策略
    resolve: {
        alias: {
            'react': path.resolve(__dirname, 'node_modules/react/umd/react.production.min.js'),
            'react-dom': path.resolve(__dirname, 'node_modules/react-dom/umd/react-dom.production.min.js')
        },
        extensions: ['.js'], // 如果是tsx或者其他的，就要设置成tsx或者其他后缀
        mainFields: ['main']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve('src'), // 只查找src下的js文件
                use: [
                    {
                        loader: 'thread-loader', // 我仿佛，来到了知识的荒原，为什么加了这个插件，反而更久？我炸了
                        options: {
                            workers: 2
                        }
                    },
                    // 'babel-loader?cacheDirectory=true', // babel-loader开启缓存
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
                            remPrecision: 8 // px转成rem时小数点的位数
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name][hash:8].[ext]', // ext: 后缀
                            outputPath: 'img',
                            esModule: false, // 服务端渲染时，不应该使用es模块语法，因此需要关闭掉
                        }
                    },
                    // {
                    //     // 压缩图片
                    //     loader: 'image-webpack-loader',
                    //     options: {
                    //         mozjpeg: {
                    //             progressive: true,
                    //             quality: 65
                    //         },
                    //         optipng: {
                    //             enabled: false
                    //         },
                    //         pdgquant: {
                    //             quality: '65-90',
                    //             speed: 4
                    //         },
                    //         gifsicle: {
                    //             interlaced: false
                    //         },
                    //         webp: {
                    //             quality: 75
                    //         }
                    //     }
                    // }
                ],
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
        // 提取css成独立的文件
        new MiniCssExtractPlugin(
            {
                filename: '[name][contenthash:8].css'
            }
        ),
        // new PurgeCssPlugin({
        //     paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
        // }),
        // new webpack.DllReferencePlugin({
        //     context: __dirname,
        //     manifest: require('./build/library/manifest.json'),
        //     sourceType: 'commonjs'
        // }),

        // new HardSourceWebpackPlugin(),

        // new CleanWebpackPlugin(),
        // new OptimizeCssAssetsWebpackPlugin({ // webpack4
        //     assetNameRegExp: /\.css$/g,
        //     cssProcessor: require('cssnano')
        // })
        // new webpack.HotModuleReplacementPlugin(),
        // new BundleAnalyzerPlugin(), // 分析打包情况
        new MyPlugin('huang'),
        new ZipPlugin({
            filename: 'offline',
        })
    ].concat(htmlWebpackPlugins),
    // stats: 'errors-only',
};
module.exports = prodConfig;//smp.wrap(prodConfig);