module.exports = class CommonPlugin {
  constructor(options) {
    this.options = options || {}
  }

  getWebpack(compiler) {
    return this.options.__webpack || compiler.webpack || require('webpack')
  }

  /**
   * @param compiler {import('webpack').Compiler}
   * @return {number}
   */
  getWebpackMajor(compiler) {
    if (!compiler.hooks) {
      throw new Error(`[MometaEditorPlugin] don't support the webpack version.`)
    }
    if ('cache' in compiler) {
      return 5
    }
    return 4
  }
}
