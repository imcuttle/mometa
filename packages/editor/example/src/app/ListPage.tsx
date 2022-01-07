import React from 'react'
import { Input, Button } from 'antd'
import 'antd/lib/input/style/css'

export default function ListPage(props: any) {
  return (
    <div>
      <h1 title={'abc'}>
        ListPage<Button type="default">按钮</Button>
      </h1>
      <Button type="default">按钮</Button>
      <Input placeholder="请输入" />
    </div>
  )
}
