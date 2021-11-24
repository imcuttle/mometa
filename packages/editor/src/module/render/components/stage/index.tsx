import * as React from 'react'
import * as p from 'prefix-classname'
import { CLS_PREFIX } from '../../../config/const'

const cn = p('')
const c = p(`${CLS_PREFIX}-stage`)

export interface StageProps {
  className?: string
}

const Stage: React.FC<StageProps> = React.memo(({ className }) => {
  return <div className={cn(c(), className)}></div>
})

Stage.defaultProps = {}

export default Stage
