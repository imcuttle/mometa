import { Middleware, OpType } from '../index'

export default function insertNodeMiddleware(): Middleware {
  return async (data, ctx, next) => {
    if (data.type === OpType.INSERT_NODE) {
      const toPos = data.preload.to
      if (!toPos) {
        return next()
      }

      // TODO
      const { newText = '', wrap, material } = data.preload.data || {}
      const line = ctx.lineContents.locateLineByPos(toPos.line)

      line.setContent(line.slice(0, toPos.column).content + newText + line.slice(toPos.column ?? Infinity).content)
    }
    return next()
  }
}
