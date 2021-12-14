import React, { Dispatch, SetStateAction, useContext } from 'react'
import p from 'prefix-classname'
import { Button, Switch } from 'antd'
import { createReactBehaviorSubject } from '@rcp/use.behaviorsubject'
import { CLS_PREFIX } from '../../../config/const'

const cn = p('')
const c = p(`${CLS_PREFIX}-header`)

export interface HeaderProps {
  className?: string
}

interface Data {
  canSelect: boolean
}

const { useSubject, subject } = createReactBehaviorSubject<Data>({
  canSelect: true
})

export const useHeaderStatus = useSubject
export const headerStatusSubject = subject

const Header: React.FC<HeaderProps> = React.memo(({ className }) => {
  const [{ canSelect }, setValue] = useHeaderStatus()

  return (
    <div className={cn(c(), className)}>
      <h3>1122abcxxaaaxxxa</h3>
      <Switch
        unCheckedChildren={'不可选'}
        checked={canSelect}
        onChange={(checked) => setValue((x) => ({ ...x, canSelect: checked }))}
        checkedChildren={'可选'}
      />
    </div>
  )
})

Header.defaultProps = {}

export default Header
