import { Button, message, Modal, Typography } from 'antd'
import { ApiCore } from './api-core'
import { OpType } from '@mometa/fs-handler/const'
import React from 'react'
import PQueue from 'p-queue'
import { Form } from 'antd'

import { CodeEditor } from '../../../../shared/code-editor'
import { MometaHTMLElement } from '../../../../mometa/preset/react/runtime/dom-api'
import { openReactStandalone } from '../../../../shared/open-react-element'
import { createPreload } from '../../utils/utils'

const getReactWrap = (anotherTo) => ({
  startStr: '<>',
  endStr: '</>',
  anotherTo
})

export class ApiServerPack extends ApiCore {
  constructor(apiBaseURL: string = '') {
    super(apiBaseURL, {
      loading: (str) => message.loading(str, 0),
      error: (str) => message.error(str)
    })
  }
  queue = new PQueue({ concurrency: 1 })
  closeTip

  protected async _submitOperation(requestData) {
    await this.axios.post('/submit-op', requestData)
    return true
  }

  async handleViewOp(opType: 'up' | 'down' | 'del' | 'copy' | 'insert-asset', dom: MometaHTMLElement, extraData?: any) {
    if (this.queue.pending && !this.closeTip) {
      this.closeTip = this.toast.loading('任务正在进行中，请等待')
    }
    try {
      return await this.queue.add(() => {
        if (this.queue.size === 0) {
          if (this.closeTip) {
            this.closeTip()
            this.closeTip = null
          }
        }
        return this._handleViewOp(opType, dom, extraData)
      })
    } finally {
      if (this.queue.pending === 0 && this.queue.size === 0) {
        if (this.closeTip) {
          this.closeTip()
          this.closeTip = null
        }
      }
    }
  }

  async confirmWhich(dom: MometaHTMLElement, opName: string, props?: any): Promise<'container' | 'self' | null> {
    const data = dom.__mometa.getMometaData()
    let p
    if (data.container?.isFirstElement) {
      p = openReactStandalone((cb) => (
        <Modal
          visible
          footer={
            <div>
              <Button type={'primary'} onClick={() => cb('container')} {...props}>
                {opName}容器
              </Button>
              <Button type={'primary'} onClick={() => cb('self')} {...props}>
                {opName}自身
              </Button>
              <Button type={'default'} size={'small'} onClick={() => cb()}>
                取消
              </Button>
            </div>
          }
        >
          <Typography>检测到元素在容器头部，请选择具体{opName}哪个，代码如下：</Typography>
          <Form layout={'vertical'} style={{ marginTop: 10 }}>
            <Form.Item label={'自身代码'}>
              <CodeEditor readOnly value={data.text} height={'100px'} />
            </Form.Item>
            <Form.Item label={'容器代码'}>
              <CodeEditor readOnly value={data.container.text} height={'200px'} />
            </Form.Item>
          </Form>
        </Modal>
      ))
    } else {
      p = new Promise((res) => {
        Modal.confirm({
          title: `确认${opName}如下代码片段吗？`,
          content: <CodeEditor readOnly value={data.text} style={{ marginTop: 10 }} />,
          okText: '确认',
          cancelText: '取消',
          okButtonProps: { ...props },
          onOk: () => res('self'),
          onCancel: () => res(null)
        })
      })
    }
    return await p
  }

  async _handleViewOp(
    opType: 'up' | 'down' | 'del' | 'copy' | 'insert-asset',
    dom: MometaHTMLElement,
    extraData?: any
  ) {
    const data = dom.__mometa.getMometaData()
    let locationData = data
    if (data.container?.isFirstElement) {
      locationData = data.container as any
    }
    switch (opType) {
      case 'insert-asset': {
        const { asset, direction } = extraData
        if (direction === 'up' || direction === 'down') {
          return this.submitOperation({
            type: OpType.INSERT_NODE,
            preload: {
              filename: data.filename,
              relativeFilename: data.relativeFilename,
              to: direction === 'up' ? data.start : data.end,
              data: {
                material: asset,
                wrap: data.isFirst ? getReactWrap(direction === 'down' ? data.start : data.end) : undefined
              }
            }
          })
        } else if (direction === 'child') {
          return this.submitOperation({
            type: OpType.INSERT_NODE,
            preload: {
              relativeFilename: data.relativeFilename,
              filename: data.filename,
              to: data.innerEnd,
              data: {
                material: asset
              }
            }
          })
        }

        break
      }
      case 'del': {
        const result = await this.confirmWhich(dom, '删除', { danger: true })
        if (result === 'self') {
          return this.submitOperation(
            {
              type: OpType.REPLACE_NODE,
              preload: {
                ...data,
                data: {
                  newText: data.isFirst ? 'null' : ''
                }
              }
            },
            '删除'
          )
        } else if (result === 'container') {
          return this.submitOperation({
            type: OpType.DEL,
            preload: createPreload(data, data.container)
          })
        }
        break
      }
      case 'up':
      case 'down': {
        let to = opType === 'up' ? data.previousSibling.start : data.nextSibling.end

        return this.submitOperation({
          type: OpType.MOVE_NODE,
          preload: createPreload(data, {
            ...locationData,
            // @ts-ignore
            data: {
              to
            }
          })
        })
      }
      case 'copy': {
        let result
        if (data.container?.isFirstElement) {
          result = await this.confirmWhich(dom, '复制')
        } else {
          result = 'self'
        }
        if (result === 'container') {
          return this.submitOperation(
            {
              type: OpType.INSERT_NODE,
              preload: createPreload(data, {
                to: locationData.end,
                data: {
                  newText: locationData.text
                }
              })
            },
            '复制'
          )
        } else if (result === 'self') {
          return this.submitOperation(
            {
              type: OpType.INSERT_NODE,
              preload: createPreload(data, {
                to: data.end,
                data: {
                  newText: data.text,
                  wrap: data.isFirst ? getReactWrap(data.start) : undefined
                }
              })
            },
            '复制'
          )
        }
      }
    }
  }
}

export default function createApi(apiBaseURL) {
  return new ApiServerPack(apiBaseURL)
}
