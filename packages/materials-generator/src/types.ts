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

// import { Button as AntButton } from 'antd'
export interface AssetImport {
  source: string // "antd"
  mode: 'default' | 'named' | 'namespace' // named
  imported?: string // "Button"
  local?: string // "AntButton"
}

export interface Asset {
  name: string
  key: any
  cover?: string
  homepage?: string

  data: {
    code: string // '<$ANT_BUTTON$></$ANT_BUTTON$>'
    dependencies?: Record<string, AssetImport> // { ANT_BUTTON: { name: 'Button', mode: 'named', source: 'antd' } }
    sideEffectDependencies?: Array<string>
  }

  runtime?: {
    previewRender?: (dom: HTMLElement) => void | (() => void)
    __fallbackPreviewRender?: (dom: HTMLElement) => void | (() => void)
  }
}
