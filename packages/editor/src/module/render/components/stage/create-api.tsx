import { Button, message, Modal, Typography } from 'antd'
import { ApiCore } from './api-core'
import { OpType } from '@mometa/fs-handler/const'
import React from 'react'

import { CodeEditor } from '../../../../shared/code-editor'
import { MometaHTMLElement } from '../../../../mometa/preset/react/runtime/dom-api'
import { openReactStandalone } from '../../../../shared/open-react-element'
import { createPreload } from '../../utils/utils'

export class ApiServerPack extends ApiCore {
  constructor(apiBaseURL: string = '') {
    super(apiBaseURL, {
      loading: (str) => message.loading(str, 0),
      error: (str) => message.error(str)
    })
  }

  protected async _submitOperation(requestData) {
    await this.axios.post('/submit-op', requestData)
    return true
  }

  async handleViewOp(opType: 'up' | 'down' | 'del' | 'copy', dom: MometaHTMLElement) {
    const data = dom.__mometa.getMometaData()
    let locationData = data
    if (data.container?.isFirstElement) {
      locationData = data.container as any
    }
    switch (opType) {
      case 'del': {
        let p
        if (data.container?.isFirstElement) {
          p = openReactStandalone((cb) => (
            <Modal
              visible
              footer={
                <div>
                  <Button type={'primary'} danger size={'small'} onClick={() => cb('container')}>
                    删除容器
                  </Button>
                  <Button type={'primary'} danger size={'small'} onClick={() => cb('self')}>
                    删除自己
                  </Button>
                  <Button type={'default'} size={'small'} onClick={() => cb()}>
                    取消
                  </Button>
                </div>
              }
            >
              <Typography>检测到元素在容器头部，请选择具体删除哪个，容器代码如下：</Typography>
              <CodeEditor readOnly value={data.container.text} style={{ marginTop: 10 }} />
            </Modal>
          ))
        } else {
          p = new Promise((res) => {
            Modal.confirm({
              title: '确认删除如下代码片段吗？',
              content: <CodeEditor readOnly value={data.text} style={{ marginTop: 10 }} />,
              okText: '确认',
              cancelText: '取消',
              onOk: () => res('self'),
              onCancel: () => res(null)
            })
          })
        }
        const result = await p
        if (result === 'self') {
          return this.submitOperation({
            type: OpType.DEL,
            preload: data
          })
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
          preload: createPreload(locationData, {
            ...locationData,
            // @ts-ignore
            data: {
              to
            }
          })
        })
      }
      case 'copy': {
        return this.submitOperation({
          type: OpType.INSERT_NODE,
          preload: createPreload(locationData, {
            to: locationData.end,
            data: {
              newText: locationData.text
            }
          })
        })
      }
    }
  }
}

export default function createApi(apiBaseURL) {
  return new ApiServerPack(apiBaseURL)
}
