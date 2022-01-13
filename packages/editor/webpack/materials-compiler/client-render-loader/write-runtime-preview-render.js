const fsExtra = require('fs-extra')
const fs = require('fs')
const nps = require('path')
const filenamify = require('filenamify')
const { sha1 } = require('object-hash')
const paths = require('../../paths')
const genCode = require('./preview-code-gen')
const goodbye = require('./bye')

const roots = new Set()
// goodbye(() => {
//   Array.from(roots.values()).forEach((file) => {
//     return fsExtra.removeSync(file)
//   })
// })

/**
 * @param react {boolean}
 * @param loaderContext {import('webpack').LoaderContext}
 * @param configFilename {string}
 * @returns {string}
 */
module.exports = async function writeRuntimePreviewRender({ configFilename, loaderContext, react, asset, path }) {
  const code = await genCode({ asset, react, path })

  const root = nps.join(paths.runtimePreviewRender, filenamify(configFilename, { replacement: '~' }))
  await fsExtra.ensureDir(root)
  const filename = nps.join(
    root,
    `preview-render-${asset.key || asset.name || ''}_${path.join('.')}_${sha1({ path, asset }).slice(0, 8)}.js`
  )

  if (fs.existsSync(filename) && fs.statSync(filename).isFile()) {
    const content = await fsExtra.readFile(filename, 'utf8')
    if (content !== code) {
      await fsExtra.writeFile(filename, code, 'utf8')
    }
  } else {
    await fsExtra.writeFile(filename, code, 'utf8')
  }

  roots.add(root)
  return filename
}
