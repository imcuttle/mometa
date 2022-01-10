const fs = require('fs')
const nps = require('path')
const { validate: validateOptions } = require('schema-utils')
const { createServer } = require('./create-server')
const injectEntry = require('./injectEntry')
const CommonPlugin = require('./common-plugin')
const ReactRefreshWebpackPlugin = require('@mometa/react-refresh-webpack-plugin')

const BUILD_PATH = nps.resolve(__dirname, '../build/standalone')
const NAME = 'MometaEditorPlugin'

const replaceTpl = (string, flag, data) => {
  return string.replace(
    new RegExp(`(\\/\\*\\s${flag}\\sstart\\s\\*\\/)(.+)(\\/\\*\\s${flag}\\send\\s\\*\\/)`, 'g'),
    (_, $1, $2, $3) => {
      return `${$1} ${data} ${$3}`
    }
  )
}

module.exports = class MometaEditorPlugin extends CommonPlugin {
  constructor(options = {}) {
    options = options || {}
    options.serverOptions = Object.assign(
      {
        host: 'localhost',
        port: 8686,
        baseURL: ''
      },
      options.serverOptions
    )
    options.editorConfig = Object.assign(
      {
        bundlerURL: '/',
        apiBaseURL: `http://${options.serverOptions.host}:${
          options.serverOptions.port
        }${`/${options.serverOptions.baseURL}`.replace(/\/+/g, '/')}`
      },
      options.editorConfig
    )
    super(
      Object.assign(
        {
          react: true,
          contentBasePath: 'mometa',
          serverOptions: {},
          editorConfig: {}
        },
        options
      )
    )
    this.options.contentBasePath = (this.options.contentBasePath + '/').replace(/\/+/g, '/').replace(/^\/$/, '')

    validateOptions(require('./options-json'), this.options, {
      name: NAME,
      baseDataPath: 'options'
    })
    this.server = null
  }

  applyForEditor(compiler) {
    const mode = compiler.options.mode || 'production'

    const major = this.getWebpackMajor(compiler)
    let CopyPlugin
    if (major < 5) {
      CopyPlugin = require('copy-webpack-plugin-webpack4')
    } else {
      CopyPlugin = require('copy-webpack-plugin')
    }

    new CopyPlugin({
      patterns: [
        {
          from: nps.join(BUILD_PATH, mode),
          to:
            major < 5
              ? `${this.options.contentBasePath}[path][name].[ext]`
              : `${this.options.contentBasePath}[path][name][ext]`,
          transform: (content, absoluteFrom) => {
            if (absoluteFrom === nps.join(BUILD_PATH, mode, 'index.html')) {
              content = replaceTpl(String(content), 'editor-config', JSON.stringify(this.options.editorConfig))
            }
            return content
          }
        }
      ]
    }).apply(compiler)
  }

  applyForRuntime(compiler) {
    const webpack = this.getWebpack(compiler)
    const { DefinePlugin } = webpack

    compiler.options.entry = injectEntry(compiler.options.entry, {
      prependEntries: [require.resolve('./assets/runtime-entry')]
    })

    new DefinePlugin({
      __mometa_env_is_local__: !!process.env.__MOMETA_LOCAL__,
      __mometa_env_is_dev__: compiler.options.mode === 'development',
      __mometa_env_which__: JSON.stringify(this.options.react ? 'react' : '')
    }).apply(compiler)

    return this.applyForReactRuntime(compiler)
  }

  applyForReactRuntime(compiler) {
    const webpack = this.getWebpack(compiler)
    const { DefinePlugin } = webpack

    if (this.options.react) {
      let hasJsxDevRuntime = false
      try {
        hasJsxDevRuntime = !!require.resolve('react/jsx-dev-runtime')
      } catch (e) {}

      new DefinePlugin({
        __mometa_env_react_jsx_runtime__: hasJsxDevRuntime
      }).apply(compiler)
    }

    if (this.options.react && this.options.react.refresh !== false) {
      const opts = Object.assign(
        {
          __webpack: this.getWebpack(compiler),
          library: compiler.options.name,
          overlay: false
        },
        this.options.react.refreshWebpackPlugin
      )
      new ReactRefreshWebpackPlugin(opts).apply(compiler)
    }
  }

  applyForServer(compiler) {
    let compilation
    let tasks = []
    const captureTask = (fn) => {
      // retunr
    }
    const beforeCompile = async (params, cb) => {
      if (this.server) {
        return cb()
      }
      const MaterialsCompiler = require('./materials-compiler')
      const mc = new MaterialsCompiler(this.options)
      this.server = await createServer({
        ...this.options.serverOptions,
        context: compiler.context,
        fileSystem: {
          // 兼容 webpack4/5
          readFile: (filename, encode, cb) =>
            compiler.inputFileSystem.readFile(filename, (err, data) => {
              const fn = typeof encode === 'function' ? encode : cb
              fn(err, data ? String(data) : data)
            }),
          writeFile: fs.writeFile
        },
        // experimentalMaterialsClientRender = true
        materialsBuild: async (filename) => {
          if (!compilation) {
            return
          }
          return mc.build(filename, compiler, compilation)
        }
      })

      cb()
    }
    compiler.hooks.beforeCompile.tapAsync(NAME, beforeCompile)
    compiler.hooks.make.tapAsync(NAME, (_compilation, callback) => {
      compilation = _compilation

      callback()
    })
  }

  apply(compiler) {
    this.applyForEditor(compiler)
    this.applyForRuntime(compiler)

    this.applyForServer(compiler)
  }
}
