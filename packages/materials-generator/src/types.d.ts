export interface Material {
  name: string
  key: any
  assetGroups: AssetGroup[]
}
export interface AssetGroup {
  name: string
  key: any
  assets: Asset[]
}
export interface AssetImport {
  source: string
  mode: 'default' | 'named' | 'namespace'
  imported?: string
  local?: string
}
export interface Asset {
  name: string
  key: any
  cover?: string
  data: {
    code: string
    dependencies?: Record<string, AssetImport>
    sideEffectDependencies?: Array<string>
  }
}
