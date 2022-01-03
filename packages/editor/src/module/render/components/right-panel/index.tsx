import React from 'react'
import p from 'prefix-classname'
import { isEqual, cloneDeep, isMatch } from 'lodash-es'
import { Button, Empty, Form, Input, Tabs, Tooltip, Typography } from 'antd'
import { NumberOutlined } from '@ant-design/icons'
import { CLS_PREFIX, useSelectedNode } from '../../../config/const'

import './style.scss'
import { useShared } from '@rcp/use.shared'
import usePersistFn from '@rcp/use.persistfn'
import { PreventFastClick } from '@rcp/c.preventfastop'
import { ApiServerPack } from '../stage/create-api'
import { OpType } from '@mometa/fs-handler/const'
import { CodeEditor } from '../../../../shared/code-editor'
import { createPreload } from '../../utils/utils'

const cn = p('')
const c = p(`${CLS_PREFIX}-rpanel`)

export interface RightPanelProps {
  className?: string
}

const BaseInfoForm = () => {
  const [selectedNode] = useSelectedNode()
  const mometaData = selectedNode?.__mometa?.getMometaData()
  const [form] = Form.useForm()
  const [api] = useShared<ApiServerPack>('api' as any)

  const UpdateBtn = React.useCallback(
    ({ onClick, loading, disabled }: any) => (
      <Tooltip title={disabled && '未发生更改，不能修改'}>
        <Button disabled={disabled} type={'primary'} onClick={onClick} loading={loading}>
          更新
        </Button>
      </Tooltip>
    ),
    []
  )

  React.useLayoutEffect(() => {
    if (form && mometaData) {
      form.setFieldsValue(cloneDeep(mometaData))
    }
  }, [form, mometaData])

  const onUpdate = usePersistFn(async () => {
    const editData = form.getFieldsValue()
    if (mometaData.container?.text && editData.container?.text !== mometaData.container?.text) {
      await api.submitOperation({
        type: OpType.REPLACE_NODE,
        preload: createPreload(mometaData, {
          ...mometaData.container,
          data: {
            newText: editData.container?.text
          }
        })
      })
    } else {
      await api.submitOperation({
        type: OpType.REPLACE_NODE,
        preload: {
          ...mometaData,
          data: {
            newText: editData.text
          }
        }
      })
    }
  })

  if (!mometaData) {
    return null
  }

  return (
    <Form
      layout={'vertical'}
      form={form}
      onFieldsChange={() => {
        // !isDirty && setIsDirty(true)
      }}
    >
      <Form.Item label={'类型'}>
        <Typography.Title level={5}>
          <Tooltip title={'点击进入代码'}>
            <Typography.Link
              onClick={() =>
                api.openEditor({
                  fileName: mometaData.filename,
                  lineNumber: mometaData.start?.line,
                  colNumber: mometaData.start?.column
                })
              }
            >
              {'📌 '}
              {mometaData.name}
            </Typography.Link>
          </Tooltip>
        </Typography.Title>
      </Form.Item>
      <Form.Item name={'text'} label={'代码'}>
        <CodeEditor language={'typescript'} height={'200px'} />
      </Form.Item>
      {!!mometaData?.container?.text && (
        <Form.Item name={['container', 'text']} label={'容器代码'} tooltip={'修改将以容器代码为主，代码修改视为无效'}>
          <CodeEditor language={'typescript'} height={'100px'} />
        </Form.Item>
      )}
      <div className={c('__btns')}>
        <Form.Item noStyle shouldUpdate>
          {({ getFieldsValue }) => {
            const editData = getFieldsValue()
            return (
              <PreventFastClick onClick={onUpdate}>
                <UpdateBtn disabled={isMatch(mometaData, editData)} />
              </PreventFastClick>
            )
          }}
        </Form.Item>
      </div>
    </Form>
  )
}

const MetaInfo = () => {
  const [selectedNode] = useSelectedNode()
  const mometaData = selectedNode?.__mometa?.getMometaData()

  if (!mometaData) {
    return null
  }

  return <CodeEditor readOnly height={'500px'} language={'json'} value={JSON.stringify(mometaData, null, 2)} />
}

const RightPanel: React.FC<RightPanelProps> = React.memo(({ className }) => {
  const [selectedNode] = useSelectedNode()
  const mometaData = selectedNode?.parentNode && selectedNode?.__mometa?.getMometaData()
  return (
    <div className={cn(c(), className)}>
      {!!mometaData ? (
        <Tabs className={c('__tabs')}>
          <Tabs.TabPane key={'attr'} tab={'属性'}>
            <BaseInfoForm />
          </Tabs.TabPane>
          <Tabs.TabPane key={'meta'} tab={'元信息'}>
            <MetaInfo />
          </Tabs.TabPane>
        </Tabs>
      ) : (
        <Empty description={'请选中编辑元素'} style={{ paddingTop: 40 }} />
      )}
    </div>
  )
})

RightPanel.defaultProps = {}

export default RightPanel
