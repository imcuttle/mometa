import type { RequestData } from '@mometa/fs-handler'
import axios, { AxiosInstance } from 'axios'
import { addUpdateCallbackListener } from '../../../../shared/hot'
import { OpType } from '@mometa/fs-handler'
import { ReactNode } from 'react'
import React from 'react'

export interface Toast {
  error: (message: ReactNode) => void | (() => void)
  // info: (message: string) => void | (() => void)
  loading: (message: ReactNode) => void | (() => void)
  // success: (message: string) => void | (() => void)
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

export abstract class ApiCore {
  protected axios: AxiosInstance
  constructor(protected apiBaseURL: string = '', protected toast: Toast) {
    this.axios = axios.create({
      baseURL: apiBaseURL,
      validateStatus: (status) => status < 400
    })
    this.axios.interceptors.response.use(undefined, (error) => {
      console.error('axios error', { ...error })
      if (error.response?.data?.error) {
        const err = new Error(error.response?.data?.error) as any
        err.toastElement = <pre style={{ textAlign: 'left', maxHeight: 400 }}>{error.response?.data?.error}</pre>
        throw err
      }
    })
  }

  public async openEditor(body: { fileName: string; lineNumber?: number; colNumber?: number }) {
    return this.doAsync(this.axios.post('/open-editor', body), {
      beforeMessage: `打开编辑器中...`
    })
  }

  async doAsync(prom: any, { beforeMessage = '' } = {}) {
    const p = Promise.resolve(prom)

    const runP = p.finally(() => {
      dispose?.()
    })
    let dispose
    Promise.race([runP, delay(100).then(() => 'TIME_OUT')]).then(
      (res) => {
        if (res === 'TIME_OUT') {
          if (beforeMessage) {
            dispose = this.toast.loading(beforeMessage)
          }
        }
      },
      (err) => {
        const msg = err.toastElement ?? err.message
        this.toast.error(msg)
        throw err
      }
    )

    return runP
  }

  public async submitOperation(requestData: RequestData): Promise<boolean> {
    const p = new Promise((resolve, reject) => {
      let updated
      let received
      let receivedData

      let timer = setTimeout(() => {
        resolve(true)
      }, 10000)

      const resolveMaybe = () => {
        if (updated && received) {
          clearTimeout(timer)
          resolve(receivedData)
        }
      }

      let dispose = addUpdateCallbackListener((exports, id) => {
        if (`./${requestData.preload.relativeFilename}` === id) {
          updated = true
          resolveMaybe()
          dispose()
        }
      })
      this._submitOperation(requestData).then((data) => {
        received = true
        receivedData = data
        resolveMaybe()
      }, reject)
    })

    const stringType = {
      [OpType.DEL]: '删除',
      [OpType.REPLACE_NODE]: '替换节点'
    }[requestData.type]

    return this.doAsync(p, {
      beforeMessage: `执行 ${stringType ?? requestData.type} 操作中...`
    })
  }
  protected abstract _submitOperation(requestData: RequestData): Promise<boolean>
}
