const createFileWatcherApi = require('./file-watcher-api')
const { materialExplorer } = require('@mometa/materials-resolver')

module.exports = class PresetCompiler {
  constructor({ webpack, major, compilation, options }) {
    this.webpack = webpack
    this.major = major
    this.compilation = compilation
    this.options = options
    this.fw = createFileWatcherApi(major)
  }
  async compile(compiler) {
    const data = await materialExplorer.search(compiler.options.context || process.cwd())
    const webpack = this.webpack
    const major = this.major
    let EntryPlugin
    if (major < 5) {
      EntryPlugin = webpack.SingleEntryPlugin
    } else {
      EntryPlugin = webpack.EntryPlugin
    }

    const BUNDLER_FILENAME = 'mometa-editor-preset.bundler.js'
    const symbol = 'EditorPreset'
    if (!data || !data.filepath) {
      throw new Error('[MM] Please set "mometa-material.config.js" in your dev root directory.')
    }
    const outputOptions = {
      jsonpFunction: 'webpackJsonp_mometa_editor_preset',
      filename: `${this.options.contentBasePath}${BUNDLER_FILENAME}`,
      chunkFilename: `${this.options.contentBasePath}mometa-editor-preset.chunk.[id].js`,
      publicPath: compiler.options.publicPath,
      target: 'web',
      library: {
        type: 'var',
        name: 'MOMETA_EDITOR_PRESET'
      }
    }
    const childCompiler = this.compilation.createChildCompiler(symbol, outputOptions, [])

    if (major < 5) {
      new webpack.LibraryTemplatePlugin(outputOptions.library.name, 'var').apply(childCompiler)
    } else {
      new webpack.library.EnableLibraryPlugin('var').apply(childCompiler)
    }
    new webpack.HotModuleReplacementPlugin().apply(childCompiler)

    const entries = {
      [this.options.name]: [
        `${require.resolve('./preset-loader')}!${data.filepath}`
        // require.resolve('./assets/editor-preset-entry')
      ]
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
    // this.fw.watchFiles(this.compilation, { fileDependencies: [data.filepath] })
    return new Promise((resolve, reject) => {
      childCompiler.runAsChild((err, entries, childCompilation) => {
        if (err) {
          reject(err)
          return
        }

        if (entries) {
          this.fileDependencies = {
            fileDependencies: Array.from(childCompilation.fileDependencies),
            contextDependencies: Array.from(childCompilation.contextDependencies),
            missingDependencies: Array.from(childCompilation.missingDependencies)
          }
        }

        if (childCompilation.errors.length > 0) {
          const errorDetails = childCompilation.errors
            .map((error) => error.message + (error.error ? ':\n' + error.error : ''))
            .join('\n')
          reject(new Error('Child compilation failed:\n' + errorDetails))
          return
        }

        resolve(this.fileDependencies)
      })
    })
  }
}
