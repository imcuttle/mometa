import { Middleware, OpType } from '../index'
import { EMPTY } from '../utils/line-contents'

export default function reactDelMiddleware(): Middleware {
  return async (data, ctx, next) => {
    if (data.type === OpType.DEL) {
      const { lineContents, lines } = await ctx.assertLocateByRange()
      lines.forEach(({ lineNumber, start, end }) => {
        const lineModel = lineContents.locateLineByPos(lineNumber)
        if (start == 0 && end == null) {
          lineModel.content = EMPTY
        } else {
          // @ts-ignore
          lineModel.content = (lineModel.content.slice(0, start) + lineModel.content.slice(end)).trim()
          // @ts-ignore
          if (!lineModel.content.trim()) {
            lineModel.content = EMPTY
          }
        }
      })

      return ctx.writeFile(lineContents.toString())
    }
    return next()
  }
}
