// 分包
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        react: [
            'react',
            'react-dom'
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false // 保证不把打包的注释单独提出作为一个txt文件
            })
        ]
    },
    output: {
        filename: '[name]_[chunkhash].dll.js',
        path: path.join(__dirname, 'build/library'),
        library: '[name]',
        clean: true
    },
    plugins: [
        new webpack.DllPlugin({
            name: '[name]',
            path: path.join(__dirname, 'build/library/manifest.json')
        })
    ]
}