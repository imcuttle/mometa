import * as React from 'react'
import * as p from 'prefix-classname'
import { CLS_PREFIX } from '../../../config/const'
import Header from '../header'
import Stage from '../stage'
import RightPanel from '../right-panel'

const cn = p('')
const c = p(`${CLS_PREFIX}`)

export interface EditorProps {
  className?: string
}

const Editor: React.FC<EditorProps> = React.memo(({ className }) => {
  return (
    <div className={cn(c(), className)}>
      <Header />
      <div className={c('__main-content')}>
        <Stage className={c('__stage')} />
        <RightPanel className={c('__r-panel')} />
      </div>
    </div>
  )
})

Editor.defaultProps = {}

export default Editor
