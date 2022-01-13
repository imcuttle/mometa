const vm = require('vm')
const CommonPlugin = require('../common-plugin')
const { clientRenderCompile, compilerName } = require('./client-render-compile')

module.exports = class MaterialsCompiler extends CommonPlugin {
  constructor(props, compilation, webpack) {
    super(props)
    this.compilation = compilation
    this.webpack = webpack
  }

  async build(filename) {
    return new Promise((resolve, reject) => {
      const compilation = this.compilation
      const compiler = this.compilation.compiler
      /**
       * @type {import('webpack')}
       */
      const webpack = this.getWebpack(compiler)
      const major = this.getWebpackMajor(compiler)
      const EntryPlugin = webpack.EntryPlugin || webpack.SingleEntryPlugin

      const symbol = 'mometa-materials'
      const BUNDLER_FILENAME = `${this.options.contentBasePath}${symbol}.[contenthash].bundler.js`
      const name = symbol.replace(/-/g, '_').toUpperCase()

      const outputOptions = {
        jsonpFunction: `webpackJsonp_${symbol}`,
        filename: BUNDLER_FILENAME,
        chunkFilename: `${this.options.contentBasePath}${symbol}.chunk.[id].js`,
        globalObject: 'globalThis',
        library: {
          type: 'global',
          name
        }
      }
      const childCompiler = compilation.createChildCompiler(symbol, outputOptions, [
        new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 })
      ])

      if (major < 5) {
        new webpack.LibraryTemplatePlugin(outputOptions.library.name, outputOptions.library.type).apply(childCompiler)
      } else {
        new webpack.library.EnableLibraryPlugin(outputOptions.library.type).apply(childCompiler)
      }

      const entries = {
        [this.options.name]: [filename]
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

      let ctx = { [name]: null }
      childCompiler.hooks.thisCompilation.tap(this.constructor.name, (compilation) => {
        const handler = () => {
          const assets = compilation.assets
          const keys = Object.keys(assets)
          if (keys.length !== 1) {
            return
          }

          const assetName = keys[0]
          const content = assets[assetName].source()
          const script = vm.createScript(content)

          try {
            script.runInNewContext(ctx)
          } catch (err) {
            console.error(`Materials Compiler run in nodejs failed:\n`, err)
          }
        }
        if (compilation.hooks.processAssets) {
          compilation.hooks.processAssets.tap(
            {
              name: this.constructor.name,
              stage: webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE
            },
            handler
          )
        } else {
          compilation.hooks.additionalChunkAssets.tap(this.constructor.name, handler)
        }
      })

      childCompiler.runAsChild(async (err, entries, childCompilation) => {
        const materialsConfig = ctx[name]
        if (err) {
          err.message = `Materials Compiler failed:\n${err.message}`
          reject(err)
          return
        }

        if (childCompilation.errors.length > 0) {
          const errorDetails = childCompilation.errors
            .slice(0, 1)
            .map((error) => error.message + (error.error ? ':\n' + error.error : ''))
            .join('\n')
          // reject(new Error('Materials Compiler failed:\n' + errorDetails))
          console.error('Materials Compiler failed:\n' + errorDetails)
        }

        if (entries) {
          const clientRenderResult = await clientRenderCompile(materialsConfig, {
            compilation,
            webpack,
            configFilename: filename,
            fileDependencies: childCompilation.fileDependencies,
            contentBasePath: this.options.contentBasePath,
            react: !!this.options.react,
            materialsConfigName: name
          })

          const set = new Set()
          entries.forEach((entry) => {
            entry.files.forEach((v) => {
              set.add(v)
            })
          })
          if (clientRenderResult && clientRenderResult.files) {
            clientRenderResult.files.forEach((f) => set.add(f))
          }

          resolve({
            assets: childCompilation.assets,
            client: {
              name,
              files: Array.from(set.values())
                .filter((file) => !file.endsWith('.map'))
                .map((src) => (src.startsWith('/') ? src : `/${src}`))
            }
          })
        }

        reject(new Error('Materials Compiler failed: Empty entries'))
      })
    })
  }
}
