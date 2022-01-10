import { cosmiconfig } from 'cosmiconfig'
import * as nps from 'path'

function isModFile(filename: string, mod) {
  const base = nps.basename(filename)
  // if (base === 'package.json') {
  //   return !!require(filename)[mod]
  // }
  return base.includes(mod)
}

export const materialExplorer = cosmiconfig('mometa-material', {
  searchPlaces: ['mometa-material.config.js']
})
export function isMaterialsFile(filename: string) {
  return isModFile(filename, 'mometa-material')
}
