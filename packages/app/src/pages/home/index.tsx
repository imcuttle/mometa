import React from 'react'
import { Form, Spin, Table, Input } from 'antd'
import useFetcher from '@rcp/use.fetcher'
import { getUsers } from '../../api'

const SearchForm = () => {
  return (
    <Form>
      <Form.Item label={'ID'}>
        <Input />
      </Form.Item>
    </Form>
  )
}

export default function HomePage() {
  const [users, , { loading }] = useFetcher(getUsers, { suspense: false })

  return (
    <Spin spinning={loading}>
      <SearchForm />
      <Table dataSource={users} columns={[{ dataIndex: 'userId' }]} />
    </Spin>
  )
}
