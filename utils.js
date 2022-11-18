'use strict';
const glob = require('glob');
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin'); // 不用手动添加打包结果到index.html,webpack自动添加其置。
module.exports = {
    setMPA: (isServer = false) => {
        const entry = {};
        const htmlWebpackPlugin = [];

        const entryFiles = glob.sync(`./src/page/*/index${isServer ? '-server' : ''}.js`);
        
        Object.keys(entryFiles).map((index) => {
            const entryFile = entryFiles[index];

            const matchResIndex = `index${isServer ? '-server' : ''}`;
            const matchRes = entryFile.match(new RegExp(`src/page/(.*)/${matchResIndex}.js`));

            const pageName = matchRes && matchRes[1];

            entry[pageName] = entryFile;
            if(pageName) {
                htmlWebpackPlugin.push(
                    new HTMLWebpackPlugin({
                        template: `./src/page/${pageName}/index.html`,
                        filename: `${pageName}.html`,
                        chunks: [pageName, 'vendors'],
                        inject: true,
                        minify: {
                            html: true,
                            collapseInlineTagWhitespace: true,
                            preserveLineBreaks: true,
                            minifyCSS: true,
                            minifyJS: true,
                            removeComments: false
                        }
                    }),
                )

            }
        });
        return {
            entry,
            htmlWebpackPlugin
        }
    }
}