import React from 'react'
import p from 'prefix-classname'
import { Button, Divider, Tooltip } from 'antd'
import { MobileOutlined, MobileTwoTone, EditOutlined, EditTwoTone, LinkOutlined } from '@ant-design/icons'
import { createReactBehaviorSubject, UseBehaviorSubjectOpts } from '@rcp/use.behaviorsubject'
import { CLS_PREFIX } from '../../../config/const'

import './style.scss'
import { symbol } from '../../utils/utils'

const cn = p('')
const c = p(`${CLS_PREFIX}-header`)

export interface HeaderProps {
  className?: string
  bundlerURL?: string
}

interface Data {
  canSelect: boolean
  showLocation: boolean
  isMobileMode: boolean
}

function createReactBehaviorSubjectStored<T>(
  d: T,
  { storeKey, ...opts }: { storeKey: string } & UseBehaviorSubjectOpts
) {
  try {
    const prev = JSON.parse(localStorage.getItem(storeKey))
    if (prev && typeof prev === 'object') {
      d = {
        ...d,
        ...prev
      }
    }
  } catch (e) {}

  const { useSubject, subject } = createReactBehaviorSubject<T>(d, opts)
  subject.subscribe((value) => {
    localStorage.setItem(storeKey, JSON.stringify(value))
  })

  return {
    subject,
    useSubject
  }
}

const { useSubject, subject } = createReactBehaviorSubjectStored<Data>(
  {
    canSelect: false,
    showLocation: true,
    isMobileMode: false
  },
  { storeKey: symbol(`headerStatus`) }
)

export const useHeaderStatus = useSubject
export const headerStatusSubject = subject

const Header: React.FC<HeaderProps> = React.memo(({ className, bundlerURL }) => {
  const [{ canSelect, showLocation, isMobileMode }, setValue] = useHeaderStatus()

  return (
    <div className={cn(c(), className)}>
      <div className={c('__logo')}>
        <a target={'_blank'} href={'https://github.com/imcuttle/mometa'} style={{ color: 'inherit' }}>
          mometa
        </a>
      </div>

      <Divider type={'vertical'} />

      <div className={c('__switch')}>
        <Tooltip title={'编辑模式'}>
          <Button
            shape={'circle'}
            onClick={() => setValue((x) => ({ ...x, canSelect: !x.canSelect }))}
            icon={canSelect ? <EditTwoTone /> : <EditOutlined />}
            type={'text'}
          />
        </Tooltip>
        <Tooltip title={'地址栏'}>
          <Button
            shape={'circle'}
            onClick={() => setValue((x) => ({ ...x, showLocation: !x.showLocation }))}
            icon={<LinkOutlined style={{ color: showLocation ? '#1890ff' : '' }} />}
            type={'text'}
          />
        </Tooltip>
        <Tooltip title={'响应式布局'}>
          <Button
            shape={'circle'}
            onClick={() => setValue((x) => ({ ...x, isMobileMode: !x.isMobileMode }))}
            icon={isMobileMode ? <MobileTwoTone /> : <MobileOutlined />}
            type={'text'}
          />
        </Tooltip>
      </div>

      <Divider type={'vertical'} />

      <Button type="link" href={bundlerURL} target={'_blank'}>
        在新窗口预览
      </Button>
    </div>
  )
})

Header.defaultProps = {}

export default Header
