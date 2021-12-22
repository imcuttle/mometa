import { AssetGroup, Material } from '../types'
import { flatten, toArray } from '../utils/to-array'
import { groupExplorer } from '../utils/search-core'
import { resolveAsyncConfig } from '../utils/resolve-async-config'
import { resolve } from 'path'
import { sortedGlobby } from '../utils/sorted-globby'

export async function groups(findDirs: string[] | string, cwd?: string): Promise<AssetGroup[]> {
  const list = []
  const dirs = await sortedGlobby(findDirs, cwd)
  await Promise.all(
    dirs.map(async (dir) => {
      dir = resolve(cwd || '', dir)
      const d = await groupExplorer.search(dir)
      if (!d.isEmpty) {
        list.push(...flatten(await resolveAsyncConfig(d.config)))
      }
    })
  )
  return list
}
