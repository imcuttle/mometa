import { Api } from './api'
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

class ClientPackApi extends Api {
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
    super(
      {
        info: (str) => message.info(str, -1),
        error: (str) => message.error(str, -1)
      },
      createFsHandler({
        // @ts-ignore
        fs: mockFs,
        middlewares: reactMiddlewares()
      })
    )
  }
}

export default function createApi(sandpack: SandpackState) {
  return new ClientPackApi(sandpack)
}
