/** *
 file updator
 * @author
 余聪
 */
import { waterFall } from 'run-seq'
import pify from 'pify'
import lazy from 'lazy-value'
import { createLineContentsByContent, LineContents, Range } from './utils/line-contents'
import { OpType } from './const'
export * from './const'

export { default as reactMiddlewares } from './react'

export interface CommonPreload extends Range {
  filename: string
  name: string
  text: string
}

export interface DelPreload extends CommonPreload {}

export interface RequestData {
  type: OpType.DEL
  preload: DelPreload
}

type Fs = Pick<typeof import('fs'), 'readFile' | 'writeFile'>

export interface MiddlewareContext {
  fs: Fs
  filename: string
  getContent: () => Promise<string>

  assertLocateByRange: () => Promise<{
    lineContents: LineContents
    lines: ReturnType<LineContents['locateByRange']>
  }>

  writeFile: (data: any) => Promise<void>
}

export type Middleware = (request: RequestData, ctx: MiddlewareContext, next: () => any) => any

const apiMiddle: Middleware = (data, ctx, next) => {
  ctx.assertLocateByRange = async () => {
    const content = await ctx.getContent()
    const lineContents = createLineContentsByContent(content, { filename: ctx.filename })
    const lines = lineContents.locateByRange(data.preload)

    const string = new LineContents(
      lines.map((x) => x.line),
      { filename: ctx.filename }
    ).toString(false)

    if (string !== data.preload.text) {
      throw new Error(`匹配错误
${JSON.stringify(string)} !== ${JSON.stringify(data.preload.text)}`)
    }
    return {
      lineContents,
      lines
    }
  }

  ctx.writeFile = async (data) => {
    return pify(ctx.fs.writeFile)(ctx.filename, data)
  }

  return next()
}

export function createFsHandler({ fs, middlewares = [] }: { fs: Fs; middlewares?: Middleware[] }) {
  return async (request: RequestData) => {
    // @ts-ignore
    const ctx: MiddlewareContext = {
      fs,
      filename: request.preload.filename,
      getContent: lazy(() => pify(fs.readFile)(request.preload.filename, 'utf8'))
    }

    return await waterFall([apiMiddle].concat(middlewares), [request, ctx])
  }
}
