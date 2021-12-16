const fs = require('fs')
const nps = require('path')
const { createServer } = require('./create-server')
const injectEntry = require('./injectEntry')
const ReactRefreshWebpackPlugin = require('@mometa/react-refresh-webpack-plugin')

const resolvePath = (moduleName) => nps.dirname(require.resolve(`${moduleName}/package.json`))

const WHITE_MODULES = ['react', 'react-dom']

module.exports = class MometaEditorPlugin {
  constructor(options = {}) {
    this.options = Object.assign(
      {
        react: true
      },
      options
    )
    this.server = null
  }
  apply(compiler) {
    if (this.options.react && this.options.react.refresh !== false) {
      new ReactRefreshWebpackPlugin({
        library: compiler.options.name,
        overlay: false
      }).apply(compiler)
    }

    const webpack = compiler.webpack || require('webpack')
    const { DefinePlugin } = webpack

    if (this.options.react) {
      compiler.options.entry = injectEntry(compiler.options.entry, {
        prependEntries: [require.resolve('./react-runtime-entry')]
      })

      let hasJsxDevRuntime = false
      try {
        hasJsxDevRuntime = !!require.resolve('react/jsx-dev-runtime')
      } catch (e) {}

      new DefinePlugin({
        __mometa_env_react_jsx_runtime__: hasJsxDevRuntime
      }).apply(compiler)
    }

    let externals = compiler.options.externals || []
    if (!Array.isArray(externals)) {
      externals = [externals]
    }
    compiler.options.externals = externals

    externals.unshift(({ request, context = '', contextInfo = {} }, callback) => {
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
        if (WHITE_MODULES.includes(request)) {
          return callback(null, `__mometa_require__(${JSON.stringify(request)})`)
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
