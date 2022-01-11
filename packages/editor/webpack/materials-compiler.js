const { Volume, createFsFromVolume } = require('memfs')
const CommonPlugin = require('./common-plugin')

module.exports = class MaterialsCompiler extends CommonPlugin {
  constructor(props, compilation) {
    super(props)
    this.compilation = compilation
  }

  async build(filename) {
    return new Promise((resolve, reject) => {
      console.log('build')
      const compilation = this.compilation
      const compiler = this.compilation.compiler
      const webpack = this.getWebpack(compiler)
      const major = this.getWebpack(compiler)
      let EntryPlugin
      if (major < 5) {
        EntryPlugin = webpack.SingleEntryPlugin
      } else {
        EntryPlugin = webpack.EntryPlugin
      }

      const symbol = 'mometa-materials'
      const BUNDLER_FILENAME = `${this.options.contentBasePath}${symbol}.[contenthash].bundler.js`
      const name = symbol.replace(/-/g, '_').toUpperCase()

      const outputOptions = {
        jsonpFunction: `webpackJsonp_${symbol}`,
        filename: BUNDLER_FILENAME,
        chunkFilename: `${this.options.contentBasePath}${symbol}.chunk.[id].js`,
        publicPath: compiler.options.publicPath,
        target: 'web',
        library: {
          type: 'var',
          name
        }
      }
      const childCompiler = compilation.createChildCompiler(symbol, outputOptions, [])
      // childCompiler.outputFileSystem = createFsFromVolume(new Volume())

      if (major < 5) {
        new webpack.LibraryTemplatePlugin(outputOptions.library.name, 'var').apply(childCompiler)
      } else {
        new webpack.library.EnableLibraryPlugin('var').apply(childCompiler)
      }

      const entries = {
        [this.options.name]: [`${require.resolve('./materials-loader')}!${filename}`]
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

      // childCompiler.hooks.thisCompilation.tap(this.constructor.name, (compilation) => {
      //   compilation.hooks.processAssets.tap(
      //     {
      //       name: this.constructor.name,
      //       stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
      //     },
      //     (assets) => {
      //       console.log(assets)
      //
      //       for (const [name, asset] of Object.entries(assets)) {
      //         compilation.emitAsset(name, asset)
      //       }
      //     }
      //   )
      // })

      childCompiler.runAsChild((err, entries, childCompilation) => {
        if (err) {
          reject(err)
          return
        }

        if (childCompilation.errors.length > 0) {
          const errorDetails = childCompilation.errors
            .slice(0, 1)
            .map((error) => error.message + (error.error ? ':\n' + error.error : ''))
            .join('\n')
          reject(new Error('Materials Compiler failed:\n' + errorDetails))
          return
        }

        if (entries) {
          const set = new Set()
          entries.forEach((entry) => {
            entry.files.forEach((v) => {
              set.add(v)
            })
          })

          console.log('build end', Array.from(set.values()))
          resolve({
            assets: childCompilation.assets,
            client: {
              name,
              files: Array.from(set.values())
            }
          })
        }

        reject(new Error('Materials Compiler failed:\n' + 'empty entries'))
      })
    })
  }
}
