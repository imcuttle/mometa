const fs = require('fs')
const nps = require('path')
const { createServer } = require('./create-server')
const injectEntry = require('./injectEntry')
const ReactRefreshWebpackPlugin = require('@mometa/react-refresh-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const safeResolve = (path) => {
  try {
    return require.resolve(path)
  } catch (e) {
    return null
  }
}

const BUILD_PATH = nps.resolve(__dirname, '../build/standalone')
const resolvePath = (moduleName) =>
  nps.join(nps.dirname(safeResolve(`${moduleName}/package.json`) || safeResolve(moduleName)), '/')
const WHITE_MODULES = ['react', 'react-dom']
const NAME = 'MometaEditorPlugin'

const replaceTpl = (string, flag, data) => {
  return string.replace(
    new RegExp(`(\\/\\*\\s${flag}\\sstart\\s\\*\\/)(.+)(\\/\\*\\s${flag}\\send\\s\\*\\/)`, 'g'),
    (_, $1, $2, $3) => {
      return `${$1} ${data} ${$3}`
    }
  )
}

const isLocal = !!process.env.__MOMETA_LOCAL__

module.exports = class MometaEditorPlugin {
  constructor(options = {}) {
    options = options || {}
    options.serverOptions = Object.assign(
      {
        host: 'localhost',
        port: 8686,
        apiBaseURL: ''
      },
      options.serverOptions
    )
    options.editorConfig = Object.assign(
      {
        bundlerURL: '/',
        apiBaseURL: `http://${options.serverOptions.host}:${
          options.serverOptions.port
        }${`/${options.serverOptions.apiBaseURL}`.replace(/\/+/g, '/')}`
      },
      options.editorConfig
    )
    this.options = Object.assign(
      {
        react: true,
        contentBasePath: 'mometa',
        serverOptions: {},
        editorConfig: {},
        __runtime_build: false
      },
      options
    )
    this.options.contentBasePath = (this.options.contentBasePath + '/').replace(/\/+/g, '/').replace(/^\/$/, '')
    this.server = null
  }

  applyForEditor(compiler) {
    const webpack = compiler.webpack || require('webpack')
    const { EntryPlugin, optimize } = webpack
    const { SplitChunksPlugin, RuntimeChunkPlugin } = optimize || {}
    const mode = compiler.options.mode || 'production'

    const BUDLER_FILENAME = 'mometa-outer-vendor.bundler.js'
    new CopyPlugin({
      patterns: [
        {
          from: nps.join(BUILD_PATH, mode),
          to: `${this.options.contentBasePath}[path][name][ext]`,
          transform: (content, absoluteFrom) => {
            if (absoluteFrom === nps.join(BUILD_PATH, mode, 'index.html')) {
              // /**
              // __mometa_outer_vendor__ = /* outer-vendor start */ {} /* outer-vendor end */
              // __mometa_editor_config__ = /* editor-config start */ {} /* editor-config end */
              //  **/
              content = replaceTpl(
                String(content),
                'outer-vendor',
                `typeof MOMETA_OUTER_VENDOR !== 'undefined' ? MOMETA_OUTER_VENDOR : {}`
              )
              content = replaceTpl(String(content), 'editor-config', JSON.stringify(this.options.editorConfig))
              content = content.replace(
                /<head>([^]*)<\/head>/g,
                `<head><script src="${BUDLER_FILENAME}"></script>$1</head>`
              )
            }
            return content
          }
        }
      ]
    }).apply(compiler)

    compiler.hooks.make.tap(NAME, (compilation) => {
      compilation.hooks.additionalAssets.tapAsync(NAME, (childProcessDone) => {
        const outputOptions = {
          jsonpFunction: `webpackJsonp_mometa_outer_vendor`,
          filename: `${this.options.contentBasePath}${BUDLER_FILENAME}`,
          chunkFilename: `${this.options.contentBasePath}mometa-outer-vendor.chunk.[id].js`,
          publicPath: compiler.options.publicPath,
          library: {
            type: 'var',
            name: 'MOMETA_OUTER_VENDOR'
          }
        }
        const childCompiler = compilation.createChildCompiler(NAME, outputOptions, [
          new webpack.library.EnableLibraryPlugin('var')
        ])

        const entries = {
          [this.options.name]: [require.resolve('./assets/vendor-entry')]
        }
        Object.keys(entries).forEach((entry) => {
          const entryFiles = entries[entry]
          if (Array.isArray(entryFiles)) {
            entryFiles.forEach((file) => {
              new EntryPlugin(compiler.context, file, entry).apply(childCompiler)
            })
          } else {
            new EntryPlugin(compiler.context, entryFiles, entry).apply(childCompiler)
          }
        })

        childCompiler.runAsChild((err, entries, childCompilation) => {
          if (err) {
            // defer.reject(err)
            return childProcessDone(err)
          }

          if (childCompilation.errors.length > 0) {
            // defer.reject(childCompilation.errors[0])
            return childProcessDone(childCompilation.errors[0])
          }

          // defer.resolve(childCompilation.assets)
          childProcessDone()
        })
      })
    })
  }

  applyForRuntime(compiler) {
    let externals = compiler.options.externals || []
    if (!Array.isArray(externals)) {
      externals = [externals]
    }
    compiler.options.externals = externals
    externals.unshift(({ request, context = '', contextInfo = {} }, callback) => {
      const issuer = contextInfo.issuer || ''
      const whiteList = [
        ...WHITE_MODULES.map((module) => resolvePath(module)),
        nps.join(__dirname, '../build/runtime-entry'),
        /\/__mometa_require__\.(js|jsx|ts|tsx)$/
      ]

      const isMatched = whiteList.find((rule) => {
        if (rule instanceof RegExp) {
          return rule.test(issuer)
        }
        return issuer.startsWith(rule)
      })

      if (
        this.options.__runtime_build &&
        ['react/jsx-dev-runtime', '@mometa/react-refresh-webpack-plugin/lib/runtime/RefreshUtils'].includes(request)
      ) {
        return callback(null, `commonjs ${request}`)
      }

      if (isMatched) {
        if (this.options.__runtime_build && WHITE_MODULES.includes(request)) {
          return callback(null, `commonjs ${request}`)
        }
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

    this.applyForReactRuntime(compiler)
  }

  applyForReactRuntime(compiler) {
    const webpack = compiler.webpack || require('webpack')
    const { DefinePlugin } = webpack

    compiler.options.entry = injectEntry(compiler.options.entry, {
      prependEntries: [require.resolve('./assets/runtime-entry')]
    })

    new DefinePlugin({
      __mometa_env_is_local__: isLocal,
      __mometa_env_is_runtime_build__: !!this.options.__runtime_build
    }).apply(compiler)

    if (!this.options.__runtime_build) {
      new DefinePlugin({
        __mometa_env_is_dev__: compiler.options.mode === 'development',
        __mometa_env_which__: JSON.stringify(this.options.react ? 'react' : '')
      }).apply(compiler)

      if (this.options.react) {
        let hasJsxDevRuntime = false
        try {
          hasJsxDevRuntime = !!require.resolve('react/jsx-dev-runtime')
        } catch (e) {}

        new DefinePlugin({
          __mometa_env_react_jsx_runtime__: hasJsxDevRuntime
        }).apply(compiler)
      }
    }

    if (this.options.react && this.options.react.refresh !== false) {
      new ReactRefreshWebpackPlugin({
        library: compiler.options.name,
        overlay: false
      }).apply(compiler)
    }
  }

  applyForServer(compiler) {
    const beforeCompile = async (params, cb) => {
      if (this.server) {
        return cb()
      }
      this.server = await createServer({
        ...this.options.serverOptions,
        context: compiler.context,
        fileSystem: {
          readFile: compiler.inputFileSystem.readFile,
          writeFile: fs.writeFile
        }
      })

      cb()
    }
    compiler.hooks.beforeCompile.tapAsync(NAME, beforeCompile)
  }

  apply(compiler) {
    isLocal && console.log(`${NAME} in local mode`)

    this.applyForRuntime(compiler)
    if (this.options.__runtime_build) {
      return
    }
    this.applyForEditor(compiler)
    this.applyForServer(compiler)
  }
}
