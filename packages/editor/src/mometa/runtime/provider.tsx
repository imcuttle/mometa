import { SharedProvider } from '@rcp/use.shared'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import React from 'react'
import { DndProvider } from 'react-dnd'
import getWindow from 'get-window'

import { getSharedFromMain } from '../utils/get-from-main'
const { _sharedMap, _sharedUpdateMap, ddManager } = getSharedFromMain()

export function Provider({ children, dom }) {
  React.useLayoutEffect(() => {
    const bk: any = ddManager.getBackend()
    const win = getWindow(dom)
    bk.addEventListeners(win)
    return () => {
      bk.removeEventListeners(win)
    }
  }, [ddManager])

  return (
    <SharedProvider _internal={{ valuesMap: _sharedMap, updateMap: _sharedUpdateMap }}>
      <ConfigProvider locale={zhCN} prefixCls={'mmt-ant'}>
        <DndProvider manager={ddManager}>{children}</DndProvider>
      </ConfigProvider>
    </SharedProvider>
  )
}
