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
  loading?: boolean
}

const LeftPanel: React.FC<LeftPanelProps> = React.memo(({ loading, className, materials }) => {
  return (
    <div className={cn(c(), className)}>
      <MaterialPanel loading={loading} materials={materials} />
    </div>
  )
})

LeftPanel.defaultProps = {
  materials: []
}

export default LeftPanel
