import React from 'react'
import p from 'prefix-classname'
import { Radio, Empty, Image, Divider, Button, Tabs } from 'antd'
import { useDrag } from 'react-dnd'
import { LinkOutlined, DragOutlined } from '@ant-design/icons'
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
      <div className={c('__asset-group__cell', className)} style={{ opacity, ...style }}>
        <Image wrapperClassName={c('__asset-group__cell__img')} src={cover} />
        <span className={c('__asset-group__cell__name')}>
          <Button
            ref={ref}
            className={c('__asset-group__cell__icon')}
            type={'text'}
            size={'small'}
            icon={<DragOutlined />}
            title={'按住并拖动来进行移动'}
          />
          <span style={{ display: 'inline-flex', padding: '3px 4px' }} ref={preview}>
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
    )
  }

  // preview
  return renderComp({ ref: drag, opacity, className: isDragging && '-dragging' })
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
  return (
    <div className={cn(c(), className)}>
      {!materials?.length && <Empty description={'暂无物料'} style={{ marginTop: 20 }} />}
      {!!materials?.length && (
        <Tabs style={{ padding: '0 1px' }}>
          {materials.map((mat) => {
            return (
              <Tabs.TabPane key={mat.key} tab={mat.name}>
                <div className={c('__mp')}>
                  {mat.assetGroups.map((group, index, { length }) => (
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
