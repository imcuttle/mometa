import { Material } from '../types'
import { materialExplorer } from '../utils/search-core'
import { resolveAsyncConfig } from '../utils/resolve-async-config'
import { resolve } from 'path'
import { sortedGlobby } from '../utils/sorted-globby'
import { flatten } from '../utils/to-array'

export async function materials(findDirs: string[] | string, cwd?: string): Promise<Material[]> {
  const list = []
  const dirs = await sortedGlobby(findDirs, cwd)
  await Promise.all(
    dirs.map(async (dir) => {
      dir = resolve(cwd || '', dir)
      const d = await materialExplorer.search(dir)
      if (!d.isEmpty) {
        list.push(...flatten(await resolveAsyncConfig(d.config)))
      }
    })
  )
  return list
}
