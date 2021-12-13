import { ApiCore } from './api-core'
import { message } from 'antd'
import { EventEmitter } from 'events'
import { reactMiddlewares, createFsHandler } from '@mometa/fs-handler'
import React from 'react'
import { SandpackState } from '@codesandbox/sandpack-react'

declare var BrowserFS: any

const bus = new EventEmitter()
export function useFiles(files: Record<string, { code: string }> = {}) {
  const [updatedFiles, setUpdatedFiles] = React.useState({})

  React.useEffect(() => {
    const handler = ({ path, data }) => {
      setUpdatedFiles((files) => ({
        ...files,
        [path]: { code: data }
      }))
    }
    bus.on('write:done', handler)
    return () => {
      bus.off('write:done', handler)
    }
  }, [setUpdatedFiles])

  return React.useMemo(() => {
    return {
      ...files,
      ...updatedFiles
    }
  }, [updatedFiles, files])
}

class CreateApiClientPack extends ApiCore {
  constructor(sandpack: SandpackState) {
    const bFs = BrowserFS.BFSRequire('fs')
    const mockFs = {
      readFile: bFs.readFile,
      writeFile: (path, data, cb) => {
        sandpack.updateFile(path, String(data))
        console.log('path', { path, data })
        cb()
      }
    }
    // @ts-ignore
    this.handler = createFsHandler({
      // @ts-ignore
      fs: mockFs,
      middlewares: reactMiddlewares()
    })
    super({
      info: (str) => message.info(str),
      error: (str) => message.error(str)
    })
  }

  protected _submitOperation(requestData): any {
    // @ts-ignore
    return this.handler(requestData)
  }
}

export default function createApi(sandpack: SandpackState) {
  return new CreateApiClientPack(sandpack)
}
