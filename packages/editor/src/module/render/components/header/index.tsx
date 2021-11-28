import React from 'react'
import p from 'prefix-classname'
import { CLS_PREFIX } from '../../../config/const'

const cn = p('')
const c = p(`${CLS_PREFIX}-header`)

export interface HeaderProps {
  className?: string
}

const Header: React.FC<HeaderProps> = React.memo(({ className }) => {
  return <div className={cn(c(), className)}></div>
})

Header.defaultProps = {}

export default Header
