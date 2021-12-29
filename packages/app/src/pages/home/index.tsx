import React from 'react'
import { Form, Spin, Table, Typography, Input, Button, Space, Popconfirm, Layout, Badge } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import useFetcher from '@rcp/use.fetcher'
import { omitBy } from 'lodash'
import { Link } from 'react-router-dom'
import { getUsers, removeUser } from '../../api'

const SearchForm = ({ onFinish }: any) => {
  const width = 120
  const [form] = Form.useForm()
  return (
    <>
      <Form form={form} onFinish={onFinish} labelCol={{ style: { width } }} style={{ marginBottom: 20 }}>
        <Form.Item label={'ID'} name={'id'}>
          <Input />
        </Form.Item>
        <Form.Item label={'姓名'} name={'name'}>
          <Input />
        </Form.Item>
        <Form.Item label={'用户名'} name={'username'}>
          <Input />
        </Form.Item>
        <Form.Item label={'Email'} name={'email'}>
          <Input />
        </Form.Item>

        <Form.Item noStyle>
          <Space style={{ marginLeft: width }}>
            <Button type={'primary'} htmlType={'submit'}>
              查询
            </Button>
            <Button
              type={'default'}
              onClick={() => {
                form.resetFields()
              }}
            >
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  )
}

export default function HomePage() {
  const [users, , { loading, fetch }] = useFetcher(getUsers, { suspense: false })
  const paramsRef = React.useRef<any>()
  const refetch = (params = paramsRef.current) => {
    paramsRef.current = params
    fetch(paramsRef.current)
  }

  return (
    <Spin spinning={loading}>
      <SearchForm
        onFinish={(vals: any) => {
          refetch(omitBy(vals, (x) => !x))
        }}
      />
      <Space style={{ display: 'flex', marginBottom: 20 }}>
        <Button icon={<PlusOutlined />} type={'primary'}>
          <Link to={'/new'} style={{ color: 'inherit' }}>
            添加用户
          </Link>
        </Button>
      </Space>
      <Table
        dataSource={users}
        rowKey={'id'}
        pagination={false}
        columns={[
          { dataIndex: 'id', title: 'ID' },
          {
            dataIndex: 'name',
            title: '姓名',
            render: (v, row) => {
              return <Link to={`/detail/${row.id}`}>{v}</Link>
            }
          },
          { dataIndex: 'username', title: '用户名' },
          { dataIndex: 'email', title: 'Email' },
          {
            dataIndex: 'op',
            title: '操作',
            align: 'center',
            width: 80,
            render: (val, row) => {
              return (
                <Space>
                  <Button size={'small'} type={'link'}>
                    <Link to={'/edit/' + row.id}>编辑</Link>
                  </Button>
                  <Popconfirm
                    title={'是否确定删除？'}
                    onConfirm={async () => {
                      await removeUser(row.id)
                      refetch()
                    }}
                  >
                    <Button size={'small'} type={'link'} danger>
                      删除
                    </Button>
                  </Popconfirm>
                </Space>
              )
            }
          }
        ]}
      />
    </Spin>
  )
}
