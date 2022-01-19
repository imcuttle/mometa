import React from 'react'
import p from 'prefix-classname'
import { Input, Empty, Image, Tabs, Typography, Spin, Popover } from 'antd'
import { useDrag } from 'react-dnd'
import Fuse from 'fuse.js'
import { SearchOutlined, InfoCircleOutlined } from '@ant-design/icons'

import { CLS_PREFIX } from '../../../config/const'

import './style.scss'
import type { Material, Asset, AssetGroup } from '@mometa/materials-generator'
import { useHeaderStatus } from '../header'

const cn = p('')
const c = p(`${CLS_PREFIX}-material-panel`)

export interface MaterialPanelProps {
  className?: string
  materials: Material[]
  loading?: boolean
}

const PreviewRender = ({ runtime }: Pick<Asset, 'runtime'>) => {
  const containerRef = React.useRef<HTMLDivElement>()
  React.useEffect(() => {
    const render = runtime?.previewRender ?? runtime?.__fallbackPreviewRender
    const dispose = render(containerRef.current)
    if (dispose) {
      return dispose
    }
  }, [runtime?.__fallbackPreviewRender, runtime?.previewRender])

  return <div ref={containerRef} />
}

const InfoIcon = ({ runtime, homepage, name, key }: Asset) => {
  if (!runtime) {
    return null
  }
  return (
    <Popover
      trigger={['click']}
      content={<PreviewRender runtime={runtime} />}
      onVisibleChange={(v) => {}}
      placement={'rightBottom'}
      overlayInnerStyle={{ minWidth: 200, minHeight: 100 }}
      title={
        <span style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>{`${name}${key ? `(${key})` : ''}`}</span>
          {!!homepage && (
            <a style={{ fontWeight: 'normal' }} href={homepage} target={'_blank'}>
              查看详情
            </a>
          )}
        </span>
      }
    >
      <InfoCircleOutlined style={{ marginRight: 2, fontSize: 12 }} />
    </Popover>
  )
}

const AssetUI = React.memo<Asset>((asset) => {
  const { homepage, cover, name, data, runtime } = asset
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
      <div ref={ref} className={c('__asset-group__cell', className)} style={{ opacity, ...style }}>
        <Image
          preview={false}
          wrapperClassName={c('__asset-group__cell__img__wrapper')}
          className={c('__asset-group__cell__img')}
          src={cover}
        />
        <span className={c('__asset-group__cell__name')}>
          <InfoIcon {...asset} />
          <span style={{ display: 'inline-flex', padding: '2px 3px', fontSize: 12 }} ref={preview}>
            {homepage && !runtime ? (
              <a href={homepage} style={{ lineHeight: 1 }} target={'_blank'}>
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
      <h4>{assetGroup.name}</h4>
      <div className={c('__asset-group__container')}>
        {assetGroup.assets?.map((asset) => {
          return <AssetUI {...asset} />
        })}
      </div>
    </div>
  )
})

const MaterialUi = ({ mat }: any) => {
  const [input, setInput] = React.useState('')
  const [{ canSelect }] = useHeaderStatus()

  const assetGroups = React.useMemo(() => {
    if (!input || !input.trim()) {
      return mat.assetGroups
    }
    if (!mat.assetGroups) {
      return []
    }
    return mat.assetGroups
      .map((g) => {
        const fuse = new Fuse(g.assets ?? [], {
          keys: ['name', 'key'],
          includeScore: true,
          findAllMatches: true,
          threshold: 0.3,
          isCaseSensitive: false
        })
        return {
          ...g,
          assets: fuse.search(input.trim()).map((x) => x.item)
        }
      })
      .filter((g) => g.assets?.length)
  }, [input, mat?.assetGroups])

  return (
    <>
      <div className={c('__search-wrapper')}>
        <Input
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
          }}
          suffix={<SearchOutlined />}
          className={c('__search')}
          placeholder={'输入关键字过滤物料'}
        />
        <Typography.Text type={'secondary'}>请选择以下物料拖入「页面」中</Typography.Text>
      </div>
      <div className={c('__mp')}>
        {assetGroups?.map((group, index) => (
          <AssetGroupComp key={group.key ?? index} assetGroup={group} />
        ))}
      </div>
    </>
  )
}

const MaterialPanel: React.FC<MaterialPanelProps> = React.memo(({ loading, className, materials }) => {
  return (
    <Spin spinning={loading} delay={200} className={cn(c(), className)}>
      {!materials?.length && <Empty description={'暂无物料'} style={{ paddingTop: 40 }} />}
      {!!materials?.length && (
        <Tabs className={c('__tabs')}>
          {materials.map((mat, i) => {
            const matKey = mat.key ?? i
            return (
              <Tabs.TabPane tab={mat.name} key={matKey}>
                <MaterialUi mat={mat} />
              </Tabs.TabPane>
            )
          })}
        </Tabs>
      )}
    </Spin>
  )
})

MaterialPanel.defaultProps = {}

export default MaterialPanel
