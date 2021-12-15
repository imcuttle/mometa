import React from 'react'
import p from 'prefix-classname'
import { Button, Empty, Form, Input, Tabs, Tooltip, Typography } from 'antd'
import { NumberOutlined } from '@ant-design/icons'
import { CLS_PREFIX, useSelectedNode } from '../../../config/const'

import './style.scss'
import { useShared } from '@rcp/use.shared'
import usePersistFn from '@rcp/use.persistfn'
import { PreventFastClick } from '@rcp/c.preventfastop'
import { ApiServerPack } from '../stage/create-api'
import { OpType } from '@mometa/fs-handler'
import { CodeEditor } from '../../../../shared/code-editor'

const cn = p('')
const c = p(`${CLS_PREFIX}-rpanel`)

export interface RightPanelProps {
  className?: string
}

const BaseInfoForm = () => {
  const [selectedNode] = useSelectedNode()
  const mometaData = selectedNode?.__mometa.getMometaData()
  const [form] = Form.useForm()
  const [api] = useShared<ApiServerPack>('api' as any)
  const [isDirty, setIsDirty] = React.useState(false)

  const UpdateBtn = React.useCallback(
    ({ onClick, loading }: any) => (
      <Tooltip title={!isDirty && '未发生更改，不能修改'}>
        <Button disabled={!isDirty} type={'primary'} onClick={onClick} loading={loading}>
          更新
        </Button>
      </Tooltip>
    ),
    [isDirty]
  )

  React.useLayoutEffect(() => {
    if (form && mometaData) {
      form.setFieldsValue(mometaData)
      setIsDirty(false)
    }
  }, [form, mometaData, setIsDirty])

  const onUpdate = usePersistFn(async () => {
    const newText = form.getFieldsValue().text
    await api.submitOperation({
      type: OpType.REPLACE_NODE,
      preload: {
        ...mometaData,
        newValue: newText
      }
    })
    setIsDirty(false)
  })

  return !!mometaData ? (
    <div>
      <Form
        layout={'vertical'}
        form={form}
        onFieldsChange={() => {
          !isDirty && setIsDirty(true)
        }}
      >
        <Form.Item label={'类型'}>
          <Typography.Title level={5}>
            <Typography.Link
              onClick={() =>
                api.openEditor({
                  fileName: mometaData.filename,
                  lineNumber: mometaData.start?.line,
                  colNumber: mometaData.start?.column
                })
              }
            >
              <NumberOutlined style={{ marginRight: 2 }} />
              {mometaData.name}
            </Typography.Link>
          </Typography.Title>
        </Form.Item>
        <Form.Item name={'text'} label={'源代码'}>
          <CodeEditor language={'typescript'} height={'100px'} />
        </Form.Item>
        <div className={c('__btns')}>
          <PreventFastClick onClick={onUpdate}>
            <UpdateBtn />
          </PreventFastClick>
        </div>
      </Form>
      {process.env.NODE_ENV === 'development' && (
        <>
          <p> </p>
          <CodeEditor readOnly height={'300px'} language={'json'} value={JSON.stringify(mometaData, null, 2)} />
        </>
      )}
    </div>
  ) : (
    <Empty />
  )
}

const RightPanel: React.FC<RightPanelProps> = React.memo(({ className }) => {
  return (
    <Tabs className={cn(c(), className)}>
      <Tabs.TabPane key={'attr'} tab={'属性'}>
        <BaseInfoForm />
      </Tabs.TabPane>
    </Tabs>
  )
})

RightPanel.defaultProps = {}

export default RightPanel
