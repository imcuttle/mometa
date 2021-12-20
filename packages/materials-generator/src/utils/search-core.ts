import { cosmiconfig } from 'cosmiconfig'
import * as nps from 'path'

function isModFile(filename: string, mod) {
  const base = nps.basename(filename)
  if (base === 'package.json') {
    return !!require(filename)[mod]
  }
  return base.includes(mod)
}

export const materialsExplorer = cosmiconfig('mometa-materials')
export function isMaterialsFile(filename: string) {
  return isModFile(filename, 'mometa-materials')
}

export const groupsExplorer = cosmiconfig('mometa-groups')
export function isGroupsFile(filename: string) {
  return isModFile(filename, 'mometa-groups')
}

export const assetsExplorer = cosmiconfig('mometa-assets')
export function isAssetsFile(filename: string) {
  return isModFile(filename, 'mometa-assets')
}
