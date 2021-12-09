/** *
 file updator
 * @author
 余聪
 */
import { waterFall } from 'run-seq'
import * as pify from 'pify'
import lazy from 'lazy-value'

export { default as reactMiddlewares } from './react'

export const enum OpType {
  DEL,
  INSERT
}

export interface CommonPreload {
  filename: string
  name: string
  text: string
}

export interface DelPreload extends CommonPreload {}

export type RequestData = {
  type: OpType.DEL
  preload: DelPreload
}

export type Middleware = (
  request: RequestData,
  ctx: {
    getContent: () => Promise<string>
  },
  next: () => any
) => any

export function createFsHandler({ fs, middlewares = [] }: { fs: typeof import('fs'); middlewares?: Middleware[] }) {
  return async (request: RequestData) => {
    const ctx = {
      getContent: lazy(() => pify(fs.readFile)(request.preload.filename, 'utf8'))
    }

    return await waterFall(middlewares, [request, ctx])
  }
}
