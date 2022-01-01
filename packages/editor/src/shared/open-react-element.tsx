import { createOpenReactStandalone } from '@rcp/util.open'
import React from 'react'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'

export const openReactStandalone = createOpenReactStandalone({
  wrapper: (elem) => (
    <ConfigProvider locale={zhCN} prefixCls={'mmt-ant'}>
      {elem}
    </ConfigProvider>
  )
})
