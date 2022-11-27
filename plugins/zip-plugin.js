const JSZip = require('jszip');
const RawSource = require('webpack-sources').RawSource;
const path = require('path');
const zip = new JSZip();
module.exports = class ZipPlugin {
    constructor (options) {
        this.options = options;
    }
    apply(compiler) {
        compiler.hooks.emit.tapAsync('ZipPlugin', (compilation, callback) => {
            const folder = zip.folder(this.options.filename);
            for(let filename in compilation.assets) {
                const source = compilation.assets[filename].source;
                folder.file(filename, source);
            }
            zip.generateAsync({
                type: 'nodebuffer'
            }).then((content) => {
                // console.log(compilation.options)
                const outputPath = path.join(compilation.options.output.path, this.options.filename + '.zip');
                compilation.assets[outputPath] = new RawSource(content);
                callback();
            })
        })
    }
}