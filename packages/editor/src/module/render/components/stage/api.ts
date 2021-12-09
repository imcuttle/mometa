import { RequestData, createFsHandler } from '@mometa/fs-handler'

export interface Toast {
  error: (message: string) => void | (() => void)
  info: (message: string) => void | (() => void)
  // success: (message: string) => void | (() => void)
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms))

export abstract class Api {
  constructor(protected toast: Toast, protected handler: ReturnType<typeof createFsHandler>) {}
  public async submitOperation(requestData: RequestData): Promise<boolean> {
    const p = Promise.resolve(this._submitOperation(requestData))

    let dispose
    Promise.race([
      p
        .then(() => {})
        .finally(() => {
          dispose?.()
        }),
      delay(100).then(() => 'TIME_OUT')
    ]).then((res) => {
      if (res === 'TIME_OUT') {
        dispose = this.toast.info(`执行 ${requestData.type} 操作中...`)
      }
    })

    return p
  }
  protected _submitOperation(requestData: RequestData) {
    return this.handler(requestData)
  }
}
