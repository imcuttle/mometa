module.exports = class CommonPlugin {
  constructor(options) {
    this.options = options || {}
  }

  getWebpack(compiler) {
    return this.options.__webpack || compiler.webpack || require('webpack')
  }

  getWebpackMajor(compiler) {
    const webpack = this.getWebpack(compiler)
    const [major] = (webpack.version || '5.0.0').split('.')
    return major
  }
}
