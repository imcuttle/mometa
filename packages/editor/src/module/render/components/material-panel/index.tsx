import React from 'react'
import p from 'prefix-classname'
import { Tooltip, Empty, Image, Divider, Tabs } from 'antd'
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

const AssetUI = React.memo<Asset>(({ homepage, cover, name, data }) => {
  const item = React.useMemo(() => ({ cover, name, data }), [cover, name, data])
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: 'asset',
      item,
      end: (item, monitor) => {},
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    }),
    [item]
  )
  const opacity = isDragging ? 0.4 : 1

  const renderComp = ({ ref, opacity, style, className }: any) => {
    return (
      <Tooltip title={'按住以进行拖动'}>
        <div ref={ref} className={c('__asset-group__cell', className)} style={{ opacity, ...style }}>
          <Image
            wrapperClassName={c('__asset-group__cell__img__wrapper')}
            className={c('__asset-group__cell__img')}
            src={cover}
          />
          <span className={c('__asset-group__cell__name')}>
            <span style={{ display: 'inline-flex', padding: '2px 3px' }} ref={preview}>
              {homepage ? (
                <a href={homepage} target={'_blank'}>
                  {name}
                </a>
              ) : (
                name
              )}
            </span>
          </span>
        </div>
      </Tooltip>
    )
  }

  // preview
  return renderComp({ ref: drag, opacity, className: isDragging && '-dragging' })
})

const AssetGroupComp: React.FC<{ assetGroup: AssetGroup }> = React.memo(({ assetGroup }) => {
  return (
    <div className={c('__asset-group')}>
      <h4>{assetGroup.name}</h4>
      <div className={c('__asset-group__container')}>
        {assetGroup.assets?.map((asset) => {
          return <AssetUI {...asset} />
        })}
      </div>
    </div>
  )
})

const MaterialPanel: React.FC<MaterialPanelProps> = React.memo(({ className, materials }) => {
  return (
    <div className={cn(c(), className)}>
      {!materials?.length && <Empty description={'暂无物料'} style={{ paddingTop: 40 }} />}
      {!!materials?.length && (
        <Tabs className={c('__tabs')}>
          {materials.map((mat) => {
            return (
              <Tabs.TabPane key={mat.key} tab={mat.name}>
                <div className={c('__mp')}>
                  {mat.assetGroups?.map((group, index, { length }) => (
                    <div key={group.key}>
                      <AssetGroupComp assetGroup={group} />
                      {index !== length - 1 && <Divider type={'horizontal'} />}
                    </div>
                  ))}
                </div>
              </Tabs.TabPane>
            )
          })}
        </Tabs>
      )}
    </div>
  )
})

MaterialPanel.defaultProps = {}

export default MaterialPanel
