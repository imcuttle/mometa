import { Middleware, OpType } from '../index'
import { EMPTY } from '../utils/line-contents'

export default function reactReplaceNodeMiddleware(): Middleware {
  return async (data, ctx, next) => {
    if (data.type === OpType.REPLACE_NODE) {
      const { lineContents, lines } = await ctx.assertLocateByRange()
      const newValue = data.preload.newValue || ''

      lines.forEach(({ lineNumber, start, end }, index) => {
        const lineModel = lineContents.locateLineByPos(lineNumber)

        if (index !== 0) {
          // remove all
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
        } else {
          if (start == 0 && end == null) {
            lineModel.content = newValue
          } else {
            // @ts-ignore
            lineModel.content = (lineModel.content.slice(0, start) + newValue + lineModel.content.slice(end)).trim()
            // @ts-ignore
            if (!lineModel.content.trim()) {
              lineModel.content = EMPTY
            }
          }
        }
      })

      return ctx.writeFile(lineContents.toString())
    }
    return next()
  }
}
