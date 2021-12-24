import React, { Dispatch, SetStateAction, useContext } from 'react'
import p from 'prefix-classname'
import { Button, Switch } from 'antd'
import { createReactBehaviorSubject } from '@rcp/use.behaviorsubject'
import { CLS_PREFIX } from '../../../config/const'

import './style.scss'

const cn = p('')
const c = p(`${CLS_PREFIX}-header`)

export interface HeaderProps {
  className?: string
  bundlerURL?: string
}

interface Data {
  canSelect: boolean
}

const { useSubject, subject } = createReactBehaviorSubject<Data>({
  canSelect: true
})

export const useHeaderStatus = useSubject
export const headerStatusSubject = subject

const Header: React.FC<HeaderProps> = React.memo(({ className, bundlerURL }) => {
  const [{ canSelect }, setValue] = useHeaderStatus()

  return (
    <div className={cn(c(), className)}>
      <Switch
        unCheckedChildren={'预览'}
        checked={canSelect}
        onChange={(checked) => setValue((x) => ({ ...x, canSelect: checked }))}
        checkedChildren={'编辑'}
      />

      <Button type="link" href={bundlerURL} target={'_blank'}>
        在新窗口打开
      </Button>
    </div>
  )
})

Header.defaultProps = {}

export default Header
