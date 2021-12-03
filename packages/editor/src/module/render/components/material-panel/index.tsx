import React from 'react'
import p from 'prefix-classname'
import { Radio, Empty, Image, Divider } from 'antd'
import { CLS_PREFIX } from '../../../config/const'

import './style.scss'

const cn = p('')
const c = p(`${CLS_PREFIX}-material-panel`)

export interface MaterialPanelProps {
  className?: string
  materials: Material[]
}

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

export interface Asset {
  name: string
  key: any
  cover?: string
}

const AssetGroup: React.FC<{ assetGroup: AssetGroup }> = React.memo(({ assetGroup }) => {
  return (
    <div className={c('__asset-group')}>
      <h5>{assetGroup.name}</h5>
      <div className={c('__asset-group__container')}>
        {assetGroup.assets?.map((asset) => {
          return (
            <div className={c('__asset-group__cell')}>
              <Image className={c('__asset-group__cell__img')} src={asset.cover} />
              <span className={c('__asset-group__cell__name')}>{asset.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
})

const MaterialPanel: React.FC<MaterialPanelProps> = React.memo(({ className, materials }) => {
  const [materialValue, setMaterialValue] = React.useState(materials?.[0]?.key)

  const panels = React.useMemo(() => {
    return materials.map((mat) => (
      <div className={c('__mp', mat.key === materialValue && '__map-active')}>
        {mat.assetGroups.map((group, index, { length }) => (
          <>
            <AssetGroup key={group.key} assetGroup={group} />
            {index !== length - 1 && <Divider type={'horizontal'} />}
          </>
        ))}
      </div>
    ))
  }, [materialValue, materials])

  return (
    <div className={cn(c(), className)}>
      {!materials?.length && <Empty />}
      {!!materials?.length && (
        <>
          {materials?.length > 1 && (
            <Radio.Group value={materialValue} onChange={setMaterialValue}>
              {materials.map((mat) => {
                return (
                  <Radio.Button key={mat.key} value={mat.key}>
                    {mat.name}
                  </Radio.Button>
                )
              })}
            </Radio.Group>
          )}
          {panels}
        </>
      )}
    </div>
  )
})

MaterialPanel.defaultProps = {}

export default MaterialPanel
