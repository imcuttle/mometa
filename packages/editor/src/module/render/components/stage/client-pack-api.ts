import { Api } from './api'
import { message } from 'antd'
import { reactMiddlewares, createFsHandler } from '@mometa/fs-handler'

declare var BrowserFS: any

class ClientPackApi extends Api {
  constructor() {
    super(
      {
        info: (str) => message.info(str, -1),
        error: (str) => message.error(str, -1)
      },
      createFsHandler({
        fs: BrowserFS.BFSRequire('fs'),
        middlewares: reactMiddlewares()
      })
    )
  }
}

export default function createApi() {
  return new ClientPackApi()
}
