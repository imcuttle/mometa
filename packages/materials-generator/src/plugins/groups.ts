import { AssetGroup, Material } from '../types'
import { toArray } from '../utils/to-array'
import { groupsExplorer } from '../utils/search-core'
import { resolveAsyncConfig } from '../utils/resolve-async-config'
import { resolve } from 'path'

export async function groups(findDirs: string[] | string, cwd?: string): Promise<AssetGroup[]> {
  const list = []

  await Promise.all(
    toArray(findDirs).map(async (dir) => {
      dir = resolve(cwd || '', dir)
      const d = await groupsExplorer.search(dir)
      if (!d.isEmpty) {
        list.push(await resolveAsyncConfig(d.config))
      }
    })
  )
  return list
}
