import { Asset, AssetGroup, Material } from '../types'

export function material(name: string, key: string, children: Material['assetGroups'] = []): Material {
  return {
    name,
    key,
    assetGroups: children
  }
}

export function group(name: string, key: string, assets: AssetGroup['assets'] = []): AssetGroup {
  return {
    name,
    key,
    assets
  }
}

export function asset(name: string, key: string, data: Asset['data'] = { code: '' }): Asset {
  return {
    name,
    key,
    data
  }
}
