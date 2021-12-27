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

export const groupExplorer = cosmiconfig('mometa-group', {
  searchPlaces: ['mometa-group.config.js']
})
export function isGroupsFile(filename: string) {
  return isModFile(filename, 'mometa-group')
}

export const assetExplorer = cosmiconfig('mometa-asset', {
  searchPlaces: ['mometa-asset.config.js']
})
export function isAssetsFile(filename: string) {
  return isModFile(filename, 'mometa-asset')
}
