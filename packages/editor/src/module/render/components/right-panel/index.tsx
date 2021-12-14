import React from 'react'
import p from 'prefix-classname'
import { Tabs } from 'antd'
import { CLS_PREFIX } from '../../../config/const'

import './style.scss'
import MaterialPanel, { MaterialPanelProps } from '../material-panel'

const cn = p('')
const c = p(`${CLS_PREFIX}-rpanel`)

export interface RightPanelProps {
  className?: string
}

const RightPanel: React.FC<RightPanelProps> = React.memo(({ className }) => {
  const elem = (
    <Tabs className={cn(c(), className)}>
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

RightPanel.defaultProps = {}

export default RightPanel
