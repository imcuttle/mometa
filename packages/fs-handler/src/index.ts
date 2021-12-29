/** *
 file updator
 * @author
 imcuttle
 */
import { waterFall } from 'run-seq'
import pify from 'pify'
import { robust } from 'memoize-fn'
// import type { Asset } from '@mometa/materials-generator/types/types'
import { createLineContentsByContent, LineContents, Range, Point } from './utils/line-contents'
import { OpType } from './const'

export * from './const'

export { default as commonMiddlewares } from './common'

export interface CommonPreload extends Range {
  filename: string
  text: string
}

export interface DelPreload extends CommonPreload {}
export interface ReplacePreload extends CommonPreload {
  data: {
    newText: string
  }
}
export interface MoveNodePreload extends CommonPreload {
  data: {
    to: Point
  }
}

export interface InsertNodePreload {
  filename: string
  to: Point
  data: {
    newText?: string
    wrap?: {
      anotherTo: Point
      startStr: string
      endStr: string
    }
    // material?: Asset['data']
    material?: any
  }
}

export type RequestData =
  | {
      type: OpType.DEL
      preload: DelPreload
    }
  | {
      type: OpType.REPLACE_NODE
      preload: ReplacePreload
    }
  | {
      type: OpType.MOVE_NODE
      preload: MoveNodePreload
    }
  | {
      type: OpType.INSERT_NODE
      preload: InsertNodePreload
    }

type Fs = Pick<typeof import('fs'), 'readFile' | 'writeFile'>

export interface MiddlewareContext {
  fs: Fs
  filename: string
  getContent: () => Promise<string>

  assertLocateByRange: () => Promise<{
    lineContents: LineContents
    lines?: ReturnType<LineContents['locateByRange']>
  }>

  lineContents: LineContents
  lines?: ReturnType<LineContents['locateByRange']>

  runLoop: (request: RequestData | RequestData[], ctx: MiddlewareContext) => Promise<any>

  writeFile: (data: any) => Promise<void>
}

export type Middleware = (request: RequestData, ctx: MiddlewareContext, next: () => any) => any

const matchLines = (data, lineContents, ctx) => {
  const lines = lineContents.locateByRange(data.preload)

  const string = new LineContents(
    lines.map((x) => x.line),
    { filename: ctx.filename }
  ).toString(false)

  // @ts-ignore
  if (string !== data.preload.text) {
    throw new Error(`匹配错误
${JSON.stringify(string)} !== ${JSON.stringify((data.preload as any).text)}`)
  }

  return {
    lineContents,
    lines
  }
}

const apiMiddle = (middlewares) => {
  return async (data, ctx, next) => {
    ctx.runLoop = async function runLoop(req = data, context = ctx) {
      if (Array.isArray(req)) {
        for (const reqElement of req) {
          await runLoop(reqElement, context)
        }
        return
      }

      if (req.preload?.start && req.preload?.end) {
        Object.assign(context, matchLines(req, context.lineContents, ctx))
      }

      return await waterFall(middlewares, [req, context])
    }

    ctx.assertLocateByRange = async () => {
      const content = await ctx.getContent()
      const lineContents = createLineContentsByContent(content, { filename: ctx.filename })
      // @ts-ignore
      if (data.preload.start && data.preload.end) {
        return matchLines(data, lineContents, ctx)
      }
      return {
        lineContents
      }
    }

    ctx.writeFile = async (data) => {
      return pify(ctx.fs.writeFile)(ctx.filename, data)
    }
    const { lineContents, lines } = await ctx.assertLocateByRange()
    ctx.lineContents = lineContents
    ctx.lines = lines

    return next()
  }
}

export function createFsHandler({ fs, middlewares = [] }: { fs: Fs; middlewares?: Middleware[] }) {
  return async (request: RequestData) => {
    // @ts-ignore
    const ctx: MiddlewareContext = {
      fs,
      filename: request.preload.filename,
      getContent: robust(async () => await pify(fs.readFile)(request.preload.filename, 'utf8'), {
        once: true
      })
    }

    return await waterFall(
      [apiMiddle(middlewares)].concat(middlewares).concat((data, ctx) => {
        if (ctx.lineContents.isDirty) {
          return ctx.writeFile(ctx.lineContents.toString())
        }
      }),
      [request, ctx]
    )
  }
}

export * from './utils/line-contents'
