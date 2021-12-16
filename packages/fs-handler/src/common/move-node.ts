import { Middleware, OpType } from '../index'
import { EMPTY } from '../utils/line-contents'
import delMiddleware from './del'

export default function moveNodeMiddleware(): Middleware {
  return async (data, ctx, next) => {
    if (data.type === OpType.MOVE_NODE) {
      const toPos = data.preload.data?.to
      if (!toPos) {
        return next()
      }

      const text = ctx.lines.map((x) => x.line.content).join('\n')
      delMiddleware()(
        {
          type: OpType.DEL,
          preload: {
            ...data.preload
          }
        },
        ctx,
        () => {}
      )

      const toLine = ctx.lineContents.locateLineByPos(toPos.line)
      if (toLine.content === EMPTY) {
        toLine.setContent(text)
      } else {
        toLine.setContent(
          toLine.slice(0, toPos.column).content + text + toLine.slice(toPos.column ?? toLine.content.length).content
        )
      }
    }
    return next()
  }
}
