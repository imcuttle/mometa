import findUp from 'find-up'
import * as nps from 'path'

function isModFile(filename: string, mod) {
  const base = nps.basename(filename)
  // if (base === 'package.json') {
  //   return !!require(filename)[mod]
  // }
  return base.includes(mod)
}

export const materialExplorer = {
  async search(dir) {
    const filepath = await materialExplorer.findUp(dir)
    if (!filepath) {
      return {
        filepath,
        isEmpty: true,
        config: null
      }
    }
    return {
      filepath,
      isEmpty: false,
      config: require(filepath)
    }
  },
  findUp(dir) {
    return findUp('mometa-material.config.js', {
      cwd: dir
    })
  }
}
export function isMaterialsFile(filename: string) {
  return isModFile(filename, 'mometa-material')
}
