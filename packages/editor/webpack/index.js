const fs = require('fs')
const nps = require('path')
const { createServer } = require('./create-server')

const resolvePath = (moduleName) => nps.dirname(require.resolve(`${moduleName}/package.json`))

const WHITE_MODULES = ['react', 'react-dom']

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

    externals.push(({ request, context = '', contextInfo = {} }, callback) => {
      const issuer = contextInfo.issuer || ''
      const whiteList = [...WHITE_MODULES.map((module) => resolvePath(module)), /__mometa_require__\.(js|jsx|ts|tsx)$/]

      const isMatched = whiteList.find((rule) => {
        if (rule instanceof RegExp) {
          return rule.test(issuer)
        }
        return issuer.startsWith(rule)
      })

      if (isMatched) {
        return callback()
      }

      if (this.options.react) {
        if (new RegExp(`^(${WHITE_MODULES.join('|')})$`).test(request)) {
          return callback(null, `__mometa_require__(${JSON.stringify(RegExp.$1)})`)
        }
      }

      if (/^(@@__mometa-external\/(.+))$/.test(request)) {
        return callback(null, `__mometa_require__(${JSON.stringify(RegExp.$2)})`)
      }
      callback()
    })

    const beforeCompile = async (params, cb) => {
      if (this.server) {
        return cb()
      }
      this.server = await createServer({
        ...this.options,
        context: compiler.context,
        fileSystem: {
          readFile: compiler.inputFileSystem.readFile,
          writeFile: fs.writeFile
        }
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
