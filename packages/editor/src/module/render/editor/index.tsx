import React from 'react'
import p from 'prefix-classname'
import zhCN from 'antd/lib/locale/zh_CN'
import { ConfigProvider } from 'antd'
import { CLS_PREFIX } from '../../config/const'
import Header from '../components/header'
import Stage, { StageProps } from '../components/stage'
import RightPanel, { RightPanelProps } from '../components/right-panel'

import { SharedProvider } from '@rcp/use.shared'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import './style.scss'

const cn = p('')
const c = p(`${CLS_PREFIX}`)

export interface EditorProps {
  className?: string
  stageProps?: StageProps
  rightPanelProps?: RightPanelProps
}

const Editor: React.FC<EditorProps> = React.memo(({ className, rightPanelProps, stageProps }) => {
  return (
    <SharedProvider>
      <ConfigProvider locale={zhCN}>
        <DndProvider backend={HTML5Backend}>
          <div className={cn(c(), className)}>
            <Header />
            <div className={c('__main-content')}>
              <Stage {...stageProps} className={c('__stage')} />
              <RightPanel {...rightPanelProps} className={c('__r-panel')} />
            </div>
          </div>
        </DndProvider>
      </ConfigProvider>
    </SharedProvider>
  )
})

Editor.defaultProps = {}

export default Editor
