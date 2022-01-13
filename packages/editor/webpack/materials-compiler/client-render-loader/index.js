const loaderUtils = require('loader-utils')
const writeRuntimePreviewRender = require('./write-runtime-preview-render')

/**
 * @param react
 * @param configFilename {string}
 * @param loaderContext {import('webpack').LoaderContext}
 * @returns {function(*, *): string}
 */
const getPreviewCodeGenerator = ({ configFilename, react, loaderContext }) => {
  return async (asset, path) => {
    const filename = await writeRuntimePreviewRender({ loaderContext, configFilename, react, asset, path })
    const reqPath = loaderUtils.stringifyRequest(loaderContext, filename)

    return `(function () {
  var m = require(${reqPath}).default
  return m.__esModule ? m.default : m
})()`
  }
}

/**
 *
 * @this {import('webpack').LoaderContext}
 * @returns {Promise<string>}
 */
module.exports.pitch = async function () {
  const { fileDependencies, configFilename, materialsConfig, materialsConfigName, react } = this.getOptions
    ? this.getOptions()
    : loaderUtils.getOptions(this)

  for (const fileDependency of fileDependencies.values()) {
    this.addDependency(fileDependency)
  }

  const importCodes = []
  importCodes.push(
    `import __handle from ${loaderUtils.stringifyRequest(this, `!${require.resolve('../../runtime/handle')}`)};`
  )

  const getPreviewCode = getPreviewCodeGenerator({
    configFilename,
    loaderContext: this,
    react
  })
  const tasks = []
  const entitiesData = []
  materialsConfig.forEach((material, materialIndex) => {
    if (material && material.assetGroups) {
      material.assetGroups.forEach((group, groupIndex) => {
        if (group && group.assets) {
          /**
           * @param asset {import('@mometa/materials-generator').Asset}
           */
          group.assets.forEach((asset, assetIndex) => {
            if (asset && asset.data) {
              tasks.push(async () => {
                try {
                  const path = [materialIndex, groupIndex, assetIndex]
                  const code = await getPreviewCode(asset, path)
                  entitiesData.push(
                    `
              {
                path: ${JSON.stringify(path)},
                runtime: {
                  __fallbackPreviewRender: ${code.trim()}
                }
              }
              `.trim()
                  )
                } catch (err) {
                  err.message = [
                    'Asset code generate failed',
                    'You can disable `experimentalMaterialsClientRender` feature',
                    `asset: ${JSON.stringify(asset, null, 2)}`,
                    err.message
                  ].join('\n')
                  throw err
                }
              })
            }
          })
        }
      })
    }
  })

  await Promise.all(tasks.map((f) => f()))

  return `${importCodes.join('\n')}
var clientRenderEntities = [${entitiesData.join(',')}];

export default __handle(clientRenderEntities, ${JSON.stringify(materialsConfigName)});
  `.trim()
}
