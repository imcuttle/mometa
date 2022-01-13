const { getAddMaterialOps, createLineContentsByContent } = require('@mometa/fs-handler')
const { sha1 } = require('object-hash')
const { getOptions } = require('loader-utils')

/**
 *
 * @this {import('webpack').LoaderContext}
 * @returns {Promise<string>}
 */
module.exports.pitch = async function (request) {
  this.cacheable(false)
  const { asset, react, path } = this.getOptions ? this.getOptions() : getOptions(this)
  const isReact = String(react) === 'true'

  const importCodes = []
  if (isReact) {
    importCodes.push(`import * as React from 'react';`, `import * as ReactDOM from 'react-dom';`)
  }

  const ops = await getAddMaterialOps(
    createLineContentsByContent(importCodes.join('\n')),
    { line: 0, column: 1 },
    asset.data,
    {
      esModule: true
    }
  )
  importCodes.push(ops.insertDeps?.map((x) => x.preload.data.newText.replace(/^;/, '')).join('\n') ?? '')

  return `
/* preview-render ${asset.name || ''} ${asset.key || ''} */
${importCodes.join('\n')}
export default function previewRender(dom) {
  return ${ops.insertCode ? `ReactDOM.render(${ops.insertCode.preload.data.newText}, dom)` : ''};
};`
}
