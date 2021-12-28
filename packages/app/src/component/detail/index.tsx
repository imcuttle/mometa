import useFetcher, { suspense } from '@rcp/use.fetcher'
import { Form, Input, Spin, Space, Button, message } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import { createUser, getUser, updateUser } from '../../api'

const Text = ({ value }: any) => {
  return <i>{value}</i>
}

function get(id: any) {
  if (id) {
    return getUser(id)
  }
  return null
}

export const Detail = suspense(
  function _Detail({ id, editable = id == null }: any) {
    const width = 120
    const [user] = useFetcher(get, { suspense: true }, [id])
    const [form] = Form.useForm()

    React.useLayoutEffect(() => {
      if (user) {
        form.setFieldsValue(user)
      }
    }, [user])
    return (
      <Form
        form={form}
        onFinish={async (data) => {
          if (id) {
            await updateUser(id, data)
          } else {
            await createUser(data)
          }
          message.success(id ? '修改成功' : '新建成功')
          if (!id) {
            form.resetFields()
          }
        }}
        labelCol={{ style: { width } }}
        style={{ marginBottom: 20 }}
      >
        <Form.Item label={'ID'} name={'id'}>
          {editable ? <Input /> : <Text />}
        </Form.Item>
        <Form.Item label={'姓名'} name={'name'}>
          {editable ? <Input /> : <Text />}
        </Form.Item>
        <Form.Item label={'用户名'} name={'username'}>
          {editable ? <Input /> : <Text />}
        </Form.Item>
        <Form.Item label={'Email'} name={'email'}>
          {editable ? <Input /> : <Text />}
        </Form.Item>

        <Space style={{ marginLeft: width }}>
          {editable && (
            <Button type={'primary'} htmlType={'submit'}>
              {id ? '修改' : '创建'}
            </Button>
          )}
          <Button type={'link'}>
            <Link to={'/'} replace>
              返回x
            </Link>
          </Button>
        </Space>
      </Form>
    )
  },
  { fallback: <Spin spinning style={{ display: 'flex' }} /> }
)
