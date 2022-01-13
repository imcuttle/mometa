const nps = require('path')

const webpackRoot = (exports.webpackRoot = __dirname)

exports.runtimeDir = nps.join(webpackRoot, 'runtime')
exports.runtimePreviewRender = nps.join(webpackRoot, 'runtime/preview-render')
