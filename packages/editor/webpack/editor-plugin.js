const HtmlWebpackPlugin = require('html-webpack-plugin')
const NodeTargetPlugin = require('webpack/lib/node/NodeTargetPlugin')
const JsonpTemplatePlugin = require('webpack/lib/web/JsonpTemplatePlugin')

const nps = require('path')

const NAME = 'MometaEditorPluginCore'

function getExternalsType(compilerOptions) {
  // For webpack@4
  if (compilerOptions.output.libraryTarget) {
    return compilerOptions.output.libraryTarget
  }

  // For webpack@5
  if (compilerOptions.externalsType) {
    return compilerOptions.externalsType
  }

  if (compilerOptions.output.library) {
    return compilerOptions.output.library.type
  }

  if (compilerOptions.output.module) {
    return 'module'
  }

  return 'var'
}

const createDefer = () => {
  let resolve
  let reject
  const p = new Promise((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })
  return {
    p,
    resolve,
    reject
  }
}

module.exports = class MometaEditorPluginCore {
  constructor(options) {
    this.options = Object.assign(
      {
        htmlFilename: 'mometa-editor.html',
        name: 'mometa-editor',
        excludedPlugins: []
      },
      options
    )
  }

  apply(compiler) {
    const webpack = compiler.webpack || require('webpack')
    const { EntryPlugin, ExternalsPlugin, optimize } = webpack
    const { SplitChunksPlugin, RuntimeChunkPlugin } = optimize || {}
    const isEnvProduction = compiler.options.mode === 'production' || !compiler.options.mode

    new HtmlWebpackPlugin(
      Object.assign(
        {
          inject: true,
          template: nps.resolve(__dirname, 'assets/index.html'),
          filename: this.options.htmlFilename,
          chunks: []
        },
        isEnvProduction
          ? {
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
              }
            }
          : undefined
      )
    ).apply(compiler)

    compiler.hooks.make.tap(NAME, (compilation) => {
      const outputOptions = {
        jsonpFunction: `webpackJsonp_${this.options.name}`,
        filename: `${this.options.name}.bundler.js`,
        chunkFilename: `${this.options.name}.chunk.[id].js`,
        publicPath: compiler.options.publicPath
      }
      const childCompiler = compilation.createChildCompiler(NAME, outputOptions)
      compilation.mometaEditorChildCompiler = childCompiler

      childCompiler.context = compiler.context
      childCompiler.inputFileSystem = compiler.inputFileSystem
      childCompiler.outputFileSystem = compiler.outputFileSystem

      const plugins = []
      for (const plugin of plugins) {
        plugin.apply(childCompiler)
      }

      const entries = {
        [this.options.name]: [require.resolve('./assets/editor-entry')]
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

      // Convert entry chunk to entry file
      // new JsonpTemplatePlugin().apply(childCompiler)

      if (compiler.options.optimization) {
        if (SplitChunksPlugin && compiler.options.optimization.splitChunks) {
          new SplitChunksPlugin(Object.assign({}, compiler.options.optimization.splitChunks)).apply(childCompiler)
        }
        if (RuntimeChunkPlugin && compiler.options.optimization.runtimeChunk) {
          new RuntimeChunkPlugin(Object.assign({}, compiler.options.optimization.runtimeChunk)).apply(childCompiler)
        }
      }

      if (compiler.options.target !== 'webworker' && compiler.options.target !== 'web') {
        new NodeTargetPlugin().apply(childCompiler)
      }

      if (compiler.options.externals) {
        new ExternalsPlugin(getExternalsType(compiler.options), compiler.options.externals).apply(childCompiler)
      }

      // All plugin work is done, call the lifecycle hook.
      childCompiler.hooks.afterPlugins.call(childCompiler)

      childCompiler.hooks.make.tap(NAME, (childCompilation) => {
        childCompilation.hooks.afterHash.tap(NAME, () => {
          childCompilation.hash = compilation.hash
          childCompilation.fullHash = compilation.fullHash
        })
      })

      compilation.hooks.additionalAssets.tapAsync(NAME, (childProcessDone) => {
        const defer = createDefer()
        HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapPromise(NAME, async (data) => {
          if (data.outputName === this.options.htmlFilename) {
            console.log('waiting')
            const assets = await defer.p
            const jsFiles = Object.keys(assets).filter((name) => name.endsWith('.js'))
            jsFiles.forEach((jsFile) => {
              data.assetTags.scripts.push({
                tagName: 'script',
                voidTag: false,
                attributes: {
                  defer: true,
                  src: ((compiler.options.output.publicPath || '/') + jsFile).replace(/\/+/g, '/')
                }
              })
            })
          }
        })

        childCompiler.runAsChild((err, entries, childCompilation) => {
          if (err) {
            defer.reject(err)
            return childProcessDone(err)
          }

          if (childCompilation.errors.length > 0) {
            defer.reject(childCompilation.errors[0])
            return childProcessDone(childCompilation.errors[0])
          }

          defer.resolve(childCompilation.assets)
          childProcessDone()
        })
      })
    })
  }
}
