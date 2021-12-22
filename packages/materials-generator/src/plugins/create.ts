import { Asset, AssetGroup, Material } from '../types'

export function material(
  name: string,
  key: string,
  children: Material['assetGroups'] | Promise<Material['assetGroups']> = []
): Material {
  return {
    name,
    key,
    // @ts-ignore
    assetGroups: children
  }
}

export function group(
  name: string,
  key: string,
  assets: AssetGroup['assets'] | Promise<AssetGroup['assets']> = []
): AssetGroup {
  return {
    name,
    key,
    // @ts-ignore
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
