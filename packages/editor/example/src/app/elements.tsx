import { Panel } from './Panel'
import React from 'react'
import Tabs from 'antd/es/tabs'

export const body = (
  <>
    <div>
      <p>body element</p>
      <h3>h3</h3>
      <h3>h3</h3>
      {<Panel />}
    </div>
  </>
)

export const panel = (
  <Tabs.TabPane key={'extra'} tab={'其他'}>
    <p>extra</p>
  </Tabs.TabPane>
)
