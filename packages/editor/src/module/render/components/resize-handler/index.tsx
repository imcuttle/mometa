import React from 'react'
import p from 'prefix-classname'
import { CLS_PREFIX } from '../../../config/const'

import './style.scss'

const cn = p('')
const c = p(`${CLS_PREFIX}-resize-handler`)

export interface ResizeHandlerProps {
  className?: string
  bottom?: boolean
  left?: boolean
  right?: boolean
  bottomRight?: boolean
}

const ResizeHandler: React.FC<ResizeHandlerProps> = React.memo(({ bottomRight, right, bottom, left, className }) => {
  return (
    <div
      className={cn(
        c(),
        c({
          '-left': left,
          '-bottom': bottom,
          '-right': right,
          '-bottom-right': bottomRight
        }),
        className
      )}
    />
  )
})

ResizeHandler.defaultProps = {}

export default ResizeHandler
