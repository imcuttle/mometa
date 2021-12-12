import React, { StrictMode } from 'react'
import Tabs from 'antd/es/tabs'
import 'antd/es/tabs/style/index.css'

type Props = {
  x: string
}

const array = new Array(100).fill(1)

export default function App(props: Props) {
  return (
    <div>
      <h1 title={'abc'}>Hello World</h1>
      <Tabs>
        <Tabs.TabPane key={'tool'} tab={'物料'}>
          <p className="empty"></p>
          <p>单独 p</p>
          {array.map((x, i) => (
            <p key={i}>物料__{i}</p>
          ))}
        </Tabs.TabPane>
        <Tabs.TabPane key={'attr'} tab={'属性'}></Tabs.TabPane>
      </Tabs>
    </div>
  )
}
