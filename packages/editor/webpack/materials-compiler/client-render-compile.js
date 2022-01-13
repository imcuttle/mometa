const nps = require('path')
const { runtimeDir, runtimePreviewRender } = require('../paths')

const compilerName = (exports.compilerName = 'mometa-client-render')

const entryFilename = require.resolve('../runtime/client-render-main')

function isMatch(rule, file) {
  if (rule instanceof RegExp) {
    return rule.test(file)
  }
  if (typeof rule === 'function') {
    return rule(file)
  }
  if (typeof rule === 'string') {
    return file.startsWith(rule)
  }
  if (Array.isArray(rule)) {
    return rule.some((r) => isMatch(r, file))
  }
}
/**
 * @param rule {import('webpack').RuleSetRule}
 * @param file {string}
 */
function isMatchRule(rule, file) {
  const { include, test, exclude } = rule
  return (
    (include ? isMatch(include, file) : true) &&
    (test ? isMatch(test, file) : true) &&
    (exclude ? !isMatch(exclude, file) : true)
  )
}

/**
 * @param rules {import('webpack').RuleSetRule[]}
 * @param entryPath {string}
 */
function matchRules(rules, entryPath) {
  if (rules && Array.isArray(rules)) {
    for (const rule of rules) {
      if (rule.enforce === 'pre' || rule.enforce === 'post') {
        continue
      }
      if (rule.oneOf) {
        const matched = matchRules(rule.oneOf, entryPath)
        if (matched) {
          return matched
        }
        continue
      }
      if (rule.test || rule.include) {
        if (isMatchRule(rule, entryPath)) {
          return rule
        }
      }
    }
  }
}
/**
 *
 * @param compiler {import('webpack').Compiler}
 */
exports.modifyModuleRules = async function modifyModuleRules(compiler) {
  const rules = compiler.options.module.rules
  let entry = compiler.options.entry
  if (typeof compiler.options.entry === 'function') {
    entry = await compiler.options.entry()
  }

  let entryPath
  if (typeof entry === 'object') {
    const entries = Object.entries(entry)
    if (entries.length === 0) {
      return
    }
    // 适配 array or map
    for (let [_, val] of entries) {
      if (typeof val === 'string') {
        val = {
          import: [val]
        }
      } else if (Array.isArray(val)) {
        val = {
          import: val
        }
      }

      entryPath = val.import
        .slice()
        .reverse()
        .find((path) => {
          if (
            [
              'webpack-dev-server/client',
              'webpack-hot-middleware/client',
              'webpack-plugin-serve/client',
              'react-dev-utils/webpackHotDevClient'
            ].some((chunk) => path.includes(chunk))
          ) {
            return false
          }
          return path.startsWith(compiler.context)
        })
      if (entryPath) {
        break
      }
    }
  }

  if (!entryPath) {
    return
  }

  // console.log('compiler.options.entry', entryPath, matchRules(rules, entryPath))
  const matchedRule = matchRules(rules, entryPath)
  if (matchedRule) {
    if (matchedRule.exclude) {
      if (isMatch(matchedRule.exclude, runtimeDir)) {
        throw new Error(
          `Please includes "require('@mometa/editor/webpack').runtimeClientDirs" in webpackConfig rules config: \n${JSON.stringify(
            matchedRule,
            null,
            2
          )}`
        )
      }
    }

    if (matchedRule.include && !isMatch(matchedRule.include, runtimeDir)) {
      matchedRule.include = matchedRule.include || []
      matchedRule.include = (Array.isArray(matchedRule.include) ? matchedRule.include : [matchedRule.include]).slice()
      matchedRule.include.push(runtimeDir)
    }
  }
}
/**
 *
 * @param materialsConfig {import('@mometa/materials-generator').Material[]}
 * @param compilation {import('webpack').Compilation}
 * @param webpack {import('webpack')}
 * @param contentBasePath {string}
 * @param configFilename {string}
 * @param materialsConfigName {string | string[]}
 * @param fileDependencies {Set<string>}
 * @param react {boolean}
 * @returns {Promise<{ files: string[] }>}
 */
exports.clientRenderCompile = async function clientRenderCompile(
  materialsConfig,
  { fileDependencies, materialsConfigName, configFilename, contentBasePath = '', compilation, webpack, react }
) {
  /**
   *
   * @param compilation {import('webpack').Compilation}
   * @param webpack {import('webpack')}
   */
  const clientRenderPatchLoader = function (webpack, compilation) {
    const { NormalModule } = webpack

    /**
     *
     * @param _ {{}}
     * @param normalModule {import('webpack').NormalModule}
     */
    const normalModuleLoader = (_, normalModule) => {
      if (normalModule.resource === entryFilename) {
        normalModule.loaders = normalModule.loaders || []
        normalModule.loaders.push({
          loader: require.resolve('./client-render-loader'),
          options: {
            materialsConfig,
            materialsConfigName,
            configFilename,
            fileDependencies,
            react
          }
        })
      }
    }
    if (NormalModule && typeof NormalModule.getCompilationHooks === 'function') {
      // webpack 5
      NormalModule.getCompilationHooks(compilation).loader.tap(compilerName, normalModuleLoader)
    } else {
      compilation.hooks.normalModuleLoader.tap(compilerName, normalModuleLoader)
    }
  }

  if (!materialsConfig) {
    return
  }

  const symbol = compilerName
  const EntryPlugin = webpack.EntryPlugin || webpack.SingleEntryPlugin

  const childCompiler = compilation.createChildCompiler(
    symbol,
    {
      filename: `${contentBasePath}${symbol}.[contenthash].bundler.js`,
      chunkFilename: `${contentBasePath}${symbol}.[id].chunk.js`,
      jsonpFunction: `webpackJsonp_${symbol}`
    },
    [new EntryPlugin(compilation.compiler.context, entryFilename)]
  )
  childCompiler.context = compilation.compiler.context
  childCompiler.hooks.compilation.tap(compilerName, (childCompilation) => {
    clientRenderPatchLoader(webpack, childCompilation)
  })

  return new Promise((res, rej) => {
    childCompiler.runAsChild((err, chunks, childCompilation) => {
      if (err) {
        rej(err)
        return
      }

      if (childCompilation.errors.length) {
        const errorDetails = childCompilation.errors
          .slice(0, 1)
          .map((error) => error.message + (error.error ? ':\n' + error.error : ''))
          .join('\n')
        console.error('ClientRender Compiler failed:\n' + errorDetails)
      }

      if (chunks) {
        const set = new Set()
        chunks.forEach((entry) => {
          entry.files.forEach((v) => {
            set.add(v)
          })
        })

        res({
          files: Array.from(set.values())
        })
      }

      rej(new Error('ClientRender Compiler failed: Empty entries'))
    })
  })
}
