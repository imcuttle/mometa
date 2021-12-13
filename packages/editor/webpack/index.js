const { createServer } = require('./create-server')

module.exports = class MometaEditorPlugin {
  constructor(options = {}) {
    this.options = options
    this.server = null
  }
  apply(compiler) {
    let externals = compiler.options.externals || []
    if (!Array.isArray(externals)) {
      externals = [externals]
    }
    compiler.options.externals = externals

    externals.push(({ request, context }, callback) => {
      if (this.options.react) {
        if (/^(react|react-dom)$/.test(request)) {
          return callback(null, ['parent', '__externals_modules', RegExp.$1])
        }
      }

      if (/^(@@__mometa-external\/(.+))$/.test(request)) {
        return callback(null, ['parent', '__externals_modules', RegExp.$2])
      }
      callback()
    })

    const beforeCompile = async (params, cb) => {
      if (this.server) {
        return cb()
      }
      this.server = await createServer({
        ...this.options,
        fileSystem: compiler.inputFileSystem
      })

      cb()
    }
    if (compiler.hooks) {
      compiler.hooks.beforeCompile.tapAsync('mometa', beforeCompile)
    } else {
      compiler.plugin('beforeCompile', beforeCompile)
    }

    // createServer
  }
}
