import { CLS_PREFIX, useSelectedNode } from '../../../config/const'
import { Button, Tooltip, Typography } from 'antd'
import { useShared } from '@rcp/use.shared'
import { ApiServerPack } from '../stage/create-api'
import usePersistFn from '@rcp/use.persistfn'
import { PreventFastClick } from '@rcp/c.preventfastop'
import { isMatch } from 'lodash-es'
import './style.scss'
import p from 'prefix-classname'
import React from 'react'

import { Form, FormItem, Input, Select } from '@formily/antd'
import { createForm } from '@formily/core'
import { Form as AntdForm } from 'antd'
import { createSchemaField, FormProvider } from '@formily/react'

const AntdFormItem = AntdForm.Item

const cn = p('')
const c = p(`${CLS_PREFIX}-attr-panel-view`)

const SchemaField = createSchemaField({
  components: {
    Input,
    Select,
    FormItem
  }
})

export interface AttrPanelViewProps {}

export default function AttrPanelView({}: AttrPanelViewProps) {
  const [selectedNode] = useSelectedNode()
  const mometaData = selectedNode?.__mometa?.getMometaData()
  const form = React.useMemo(() => createForm(), [])
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
      // form.setFieldsValue(cloneDeep(mometaData))
    }
  }, [form, mometaData])

  const onUpdate = usePersistFn(async () => {
    // const editData = form.getFieldsValue()
  })

  if (!mometaData) {
    return null
  }

  return (
    <FormProvider form={form}>
      <Form layout="vertical">
        <FormItem label={'定位'}>
          <Typography.Title level={5}>
            <Tooltip title={`${mometaData.relativeFilename}:${mometaData.start?.line}:${mometaData.start?.column}`}>
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
        </FormItem>

        <SchemaField
          schema={{
            type: 'object',
            properties: {
              input: {
                title: 'abc',
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input'
              },
              select: {
                title: 'abcxx',
                type: 'string',
                'x-component': 'Select',
                'x-decorator': 'FormItem',
                'x-component-props': {
                  style: {
                    width: 200,
                    marginTop: 20
                  }
                }
              }
            }
          }}
        />

        <div className={c('__btns')}>
          <AntdFormItem noStyle shouldUpdate>
            {({ getFieldsValue }) => {
              const editData = getFieldsValue()
              return (
                <PreventFastClick onClick={onUpdate}>
                  <UpdateBtn disabled={isMatch(mometaData, editData)} />
                </PreventFastClick>
              )
            }}
          </AntdFormItem>
        </div>
      </Form>
    </FormProvider>
  )
}
