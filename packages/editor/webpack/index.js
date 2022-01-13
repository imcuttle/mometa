const fs = require('fs')
const nps = require('path')
const { validate: validateOptions } = require('schema-utils')
const isEqual = require('lodash.isequal')
const { createServer } = require('./create-server')
const CommonPlugin = require('./common-plugin')
const { modifyModuleRules } = require('./materials-compiler/client-render-compile')
const { runtimePreviewRender } = require('./paths')
const ReactRefreshWebpackPlugin = require('@mometa/react-refresh-webpack-plugin')
const { materialExplorer } = require('@mometa/materials-resolver')
const { robust } = require('memoize-fn')

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
  static runtimeClientDirs = [runtimePreviewRender]

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
          experimentalMaterialsClientRender: false,
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
    const EntryPlugin = webpack.EntryPlugin || webpack.SingleEntryPlugin

    let entryNames = [undefined]
    if (compiler.options.entry) {
      if (!Array.isArray(compiler.options.entry) && typeof compiler.options.entry === 'object') {
        entryNames = Object.keys(compiler.options.entry)
      }
    }
    entryNames.forEach((name) =>
      new EntryPlugin(compiler.context, require.resolve('./runtime/runtime-entry'), name).apply(compiler)
    )

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

  /**
   * @param compiler {import('webpack').Compiler}
   */
  applyForServer(compiler) {
    const MaterialsCompiler = require('./materials-compiler')
    const serverOptions = {
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
      }
    }
    const experimentalMaterialsClientRender = this.options.experimentalMaterialsClientRender
    if (experimentalMaterialsClientRender) {
      console.log('[MM] Using experimentalMaterialsClientRender feature.')
    }
    let filepath
    let materialsBuildRef = { current: null }
    const beforeCompile = async (params, cb) => {
      if (this.server) {
        return cb()
      }
      filepath = await materialExplorer.findUp(compiler.context)
      this.server = await createServer({
        ...serverOptions,
        filepath,
        materialsWatch: !experimentalMaterialsClientRender,
        materialsBuild:
          experimentalMaterialsClientRender &&
          (async (filename) => {
            return materialsBuildRef.current(filename, true)
          })
      })
      cb()
    }
    compiler.hooks.beforeCompile.tapAsync(NAME, beforeCompile)

    if (!experimentalMaterialsClientRender) {
      return
    }

    compiler.hooks.beforeCompile.tapAsync(NAME, async (params, cb) => {
      modifyModuleRules(compiler).then(() => cb())
    })

    const memoPublish = robust(
      (preload) => {
        if (this.server) {
          this.server.es.publish(preload)
        }
      },
      { once: true, eq: isEqual }
    )

    compiler.hooks.make.tap(NAME, (compilation) => {
      const mc = new MaterialsCompiler(this.options, compilation, this.getWebpack(compiler))
      const mcBuild = robust(mc.build.bind(mc))
      materialsBuildRef.current = async (filepath, isFromClient = false) => {
        const data = await mcBuild(filepath)

        if (!isFromClient) {
          if (data.assets) {
            for (const [k, v] of Object.entries(data.assets)) {
              compilation.emitAsset(k, v)
            }
          }
          setTimeout(() => {
            memoPublish({
              type: 'set-materials-client-render',
              data: data.client
            })
          })
        }
        return data.client
      }

      compilation.hooks.additionalAssets.tapAsync(NAME, (cb) => {
        Promise.resolve(materialsBuildRef.current(filepath)).then(() => cb())
      })
    })
  }

  apply(compiler) {
    this.applyForEditor(compiler)
    this.applyForRuntime(compiler)
    this.applyForServer(compiler)
  }
}
