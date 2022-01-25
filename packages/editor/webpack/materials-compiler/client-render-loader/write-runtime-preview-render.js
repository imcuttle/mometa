const fsExtra = require('fs-extra')
const fs = require('fs')
const nps = require('path')
const filenamify = require('filenamify')
const { sha1 } = require('object-hash')
const paths = require('../../paths')
const genCode = require('./preview-code-gen')
const goodbye = require('./bye')
const locateMaterialParents = require('./../../runtime/locate-material-parents')

const roots = new Set()
// goodbye(() => {
//   Array.from(roots.values()).forEach((file) => {
//     return fsExtra.removeSync(file)
//   })
// })

/**
 * @param react {boolean}
 * @param materialsConfig {*}
 * @param asset {*}
 * @param configFilename {string}
 * @param path {number[]}
 * @returns {string}
 */
module.exports = async function writeRuntimePreviewRender({ materialsConfig, configFilename, react, asset, path }) {
  const code = await genCode({ asset, react, path })
  const parents = locateMaterialParents(materialsConfig, path)
  if (!parents) {
    throw new Error(`Path [${path.join(',')}] locate materials failed.`)
  }

  const keys = parents.map((x, i) => x.key || x.name || path[i])
  const root = nps.join(paths.runtimePreviewRender, filenamify(configFilename, { replacement: '~' }))
  await fsExtra.ensureDir(root)
  const filename = nps.join(
    root,
    filenamify(`preview-render-${keys.join('_')}_${sha1(asset).slice(0, 8)}.js`, { replacement: '~' })
  )

  if (fs.existsSync(filename) && fs.statSync(filename).isFile()) {
    const content = await fs.promises.readFile(filename, 'utf8')
    if (content !== code) {
      await fs.promises.writeFile(filename, code, 'utf8')
    }
  } else {
    await fs.promises.writeFile(filename, code, 'utf8')
  }

  roots.add(root)
  return filename
}
