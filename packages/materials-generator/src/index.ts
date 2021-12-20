import Module = NodeJS.Module

export * from './utils/resolve-async-config'
export * from './utils/search-core'

export * from './plugins/create'

import { assets } from './plugins/assets'
import { groups } from './plugins/groups'
import { materials } from './plugins/materials'

export { assets, groups, materials }

// @ts-ignore
type SearchFn<T> = (dir: Parameters<T>[0]) => ReturnType<T>

export function createSearchHelper(mod: Module) {
  return {
    materials: ((dirs) => materials(dirs, mod.path)) as SearchFn<typeof materials>,
    groups: ((dirs) => groups(dirs, mod.path)) as SearchFn<typeof groups>,
    assets: ((dirs) => assets(dirs, mod.path)) as SearchFn<typeof assets>
  }
}
