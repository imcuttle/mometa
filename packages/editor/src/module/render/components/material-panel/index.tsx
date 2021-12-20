import React from 'react'
import p from 'prefix-classname'
import { Radio, Empty, Image, Divider } from 'antd'
import { useDrag } from 'react-dnd'
import { CLS_PREFIX } from '../../../config/const'

import './style.scss'
import type { Material, Asset, AssetGroup } from '@mometa/materials-generator/types'

const cn = p('')
const c = p(`${CLS_PREFIX}-material-panel`)

export interface MaterialPanelProps {
  className?: string
  materials: Material[]
}

const AssetUI = React.memo<Asset>(({ cover, name }) => {
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: 'asset',
      item: { name },
      end: (item, monitor) => {
        // const dropResult = monitor.getDropResult()
        // if (item && dropResult) {
        //   alert(`You dropped ${item.name} into ${dropResult.name}!`)
        // }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    }),
    [name]
  )
  const opacity = isDragging ? 0.4 : 1

  const renderComp = ({ ref, opacity, preview, style, className }: any) => {
    return (
      <div ref={ref} className={c('__asset-group__cell', className)} style={{ opacity, ...style }}>
        <Image className={c('__asset-group__cell__img')} src={cover} />
        <span className={c('__asset-group__cell__name')}>{name}</span>
      </div>
    )
  }

  // preview
  return <>{renderComp({ ref: drag, opacity, className: isDragging && '-dragging' })}</>
})

const AssetGroupComp: React.FC<{ assetGroup: AssetGroup }> = React.memo(({ assetGroup }) => {
  return (
    <div className={c('__asset-group')}>
      <h5>{assetGroup.name}</h5>
      <div className={c('__asset-group__container')}>
        {assetGroup.assets?.map((asset) => {
          return <AssetUI {...asset} />
        })}
      </div>
    </div>
  )
})

const MaterialPanel: React.FC<MaterialPanelProps> = React.memo(({ className, materials }) => {
  const [materialValue, setMaterialValue] = React.useState(materials?.[0]?.key)

  const panels = React.useMemo(() => {
    return materials.map((mat) => (
      <div key={mat.key} className={c('__mp', mat.key === materialValue && '__map-active')}>
        {mat.assetGroups.map((group, index, { length }) => (
          <div key={group.key}>
            <AssetGroupComp assetGroup={group} />
            {index !== length - 1 && <Divider type={'horizontal'} />}
          </div>
        ))}
      </div>
    ))
  }, [materialValue, materials])

  return (
    <div className={cn(c(), className)}>
      {!materials?.length && <Empty description={'暂无物料'} style={{ marginTop: 20 }} />}
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
