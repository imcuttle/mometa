import React from 'react'
import p from 'prefix-classname'
import { CLS_PREFIX } from '../../config/const'
import Header from '../components/header'
import Stage, { StageProps } from '../components/stage'
import RightPanel from '../components/right-panel'

import './style.scss'

const cn = p('')
const c = p(`${CLS_PREFIX}`)

export interface EditorProps {
  className?: string
  stageProps?: StageProps
}

const Editor: React.FC<EditorProps> = React.memo(({ className, stageProps }) => {
  return (
    <div className={cn(c(), className)}>
      <Header />
      <div className={c('__main-content')}>
        <Stage {...stageProps} className={c('__stage')} />
        <RightPanel className={c('__r-panel')} />
      </div>
    </div>
  )
})

Editor.defaultProps = {}

export default Editor
