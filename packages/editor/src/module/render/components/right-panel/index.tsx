import React from 'react'
import p from 'prefix-classname'
import { Tabs } from 'antd'
import { CLS_PREFIX } from '../../../config/const'

import './style.scss'

const cn = p('')
const c = p(`${CLS_PREFIX}-rpanel`)

export interface RightPanelProps {
  className?: string
}

const RightPanel: React.FC<RightPanelProps> = React.memo(({ className }) => {
  return (
    <Tabs className={cn(c(), className)}>
      <Tabs.TabPane key={'tool'} tab={'工具盒'}></Tabs.TabPane>
      <Tabs.TabPane key={'attr'} tab={'属性'}></Tabs.TabPane>
    </Tabs>
  )
})

RightPanel.defaultProps = {}

export default RightPanel
