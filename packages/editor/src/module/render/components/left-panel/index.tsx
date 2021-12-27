import React from 'react'
import p from 'prefix-classname'
import { CLS_PREFIX } from '../../../config/const'

import './style.scss'
import MaterialPanel, { MaterialPanelProps } from '../material-panel'
import { Tabs } from 'antd'

const cn = p('')
const c = p(`${CLS_PREFIX}-left-panel`)

export interface LeftPanelProps extends Pick<MaterialPanelProps, 'materials'> {
  className?: string
}

const LeftPanel: React.FC<LeftPanelProps> = React.memo(({ className, materials }) => {
  return (
    <div className={cn(c(), className)}>
      <Tabs style={{ padding: '0 1px' }}>
        <Tabs.TabPane key={'tool'} tab={'物料'}>
          <MaterialPanel materials={materials} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
})

LeftPanel.defaultProps = {
  materials: []
}

export default LeftPanel
