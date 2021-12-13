import React from 'react'
import p from 'prefix-classname'
import { Tabs } from 'antd'
import { CLS_PREFIX } from '../../../config/const'

import './style.scss'
import MaterialPanel, { MaterialPanelProps } from '../material-panel'

const cn = p('')
const c = p(`${CLS_PREFIX}-rpanel`)

export interface RightPanelProps extends Pick<MaterialPanelProps, 'materials'> {
  className?: string
}

const RightPanel: React.FC<RightPanelProps> = React.memo(({ materials, className }) => {
  const elem = (
    <Tabs className={cn(c(), className)}>
      <Tabs.TabPane key={'tool'} tab={'物料'}>
        <MaterialPanel materials={materials} />
      </Tabs.TabPane>
      <Tabs.TabPane key={'attr'} tab={'属性'}></Tabs.TabPane>
    </Tabs>
  )
  return elem
})

// const RD = require('react-dom')
// const render = RD.render
// RD.render = function render_(elem, container, cb) {
//   console.log('container', container)
//   return render(elem, container, cb)
// }

RightPanel.defaultProps = {
  materials:
    process.env.NODE_ENV === 'development'
      ? [
          {
            name: '组件',
            key: 'component',
            assetGroups: [
              {
                name: '基础',
                key: 'basic',
                assets: [
                  {
                    name: '按钮',
                    key: 'button',
                    cover: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
                  },
                  {
                    name: '输入',
                    key: 'input',
                    cover: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg'
                  }
                ]
              }
            ]
          }
        ]
      : []
}

export default RightPanel
