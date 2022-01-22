import React, { StrictMode } from 'react'
import Tabs from 'antd/es/tabs'
import { Table, Input, Typography, Button, Dropdown, Menu, Layout, Breadcrumb, Result } from 'antd'
import 'antd/lib/table/style/css'
import 'antd/es/tabs/style/css'
import 'antd/es/breadcrumb/style/css'
import { body, panel } from './elements'
import { Panel } from './Panel'
import 'antd/lib/input/style/css'

type Props = {}

const array = new Array(100).fill(1)

export default function App(props: Props) {
  return (
    <div>
      <>
        <Typography.Title>标题</Typography.Title>
        <h1>Start</h1>
        <h1> End 11</h1>
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item>
                <a>1st Menu item</a>
              </Menu.Item>
              <Menu.Item>
                <a>2nd Menu item</a>
              </Menu.Item>
              <Menu.Item>
                <a>3rd Menu item</a>
              </Menu.Item>
            </Menu>
          }
        >
          <a>Hover me</a>
        </Dropdown>
        <Table
          dataSource={[
            {
              key: '1',
              name: '胡彦斌',
              age: 32,
              address: '西湖区湖底公园1号'
            },
            {
              key: '2',
              name: '胡彦祖',
              age: 42,
              address: '西湖区湖底公园1号'
            }
          ]}
          columns={[
            {
              title: '姓名',
              dataIndex: 'name',
              key: 'name'
            },
            {
              title: '年龄',
              dataIndex: 'age',
              key: 'age'
            },
            {
              title: '住址',
              dataIndex: 'address',
              key: 'address'
            }
          ]}
        />
      </>
      <Button type="default">按钮</Button>
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item>
              <a>1st Menu item</a>
            </Menu.Item>
            <Menu.Item>
              <a>2nd Menu item</a>
            </Menu.Item>
            <Menu.Item>
              <a>3rd Menu item</a>
            </Menu.Item>
          </Menu>
        }
      ></Dropdown>
      <Table />
      <Input placeholder="请输入 hhh" />
      <h1 title={'abc'}>Hello World👌</h1>
      <input defaultValue="abcdd" />
      <p className="empty"></p>
      <Tabs>
        <Tabs.TabPane key={'tool'} tab={'物料'}>
          {body}
          <p className="empty"></p>
          <Panel />
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1, background: '#c7e29c' }}>cell2</div>
            <div style={{ flex: 1, background: '#b39dde' }}>cell1</div>
          </div>
          <p>simple 66xxxxxasdasdas6</p>
          <p>simple 66xxxxxasdasdas6</p>
          <p>
            nested
            <strong>hahahax</strong>
          </p>
          {array.map((x, i) => (
            <p key={i}>
              <div>物料_a_zzb{i}</div>
              <div>物料_b_{i}</div>
            </p>
          ))}
        </Tabs.TabPane>
        <Tabs.TabPane key={'attr'} tab={'属性'}></Tabs.TabPane>
        {panel}
      </Tabs>
    </div>
  )
}
