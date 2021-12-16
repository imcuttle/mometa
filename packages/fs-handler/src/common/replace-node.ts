import { Middleware, OpType } from '../index'
import { EMPTY } from '../utils/line-contents'

export default function replaceNodeMiddleware(): Middleware {
  return async (data, ctx, next) => {
    if (data.type === OpType.REPLACE_NODE) {
      const { lineContents, lines } = ctx
      const newValue = data.preload.data?.newText || ''

      lines.forEach(({ lineNumber, start, end }, index) => {
        const lineModel = lineContents.locateLineByPos(lineNumber)

        if (index !== 0) {
          // remove all
          if (start == 0 && end == null) {
            lineModel.setContent(EMPTY)
          } else {
            lineModel.setContent(
              // @ts-ignore
              lineModel.content.slice(0, start) + lineModel.content.slice(end ?? lineModel.content.length)
            )

            // @ts-ignore
            if (!lineModel.content.trim()) {
              lineModel.setContent(EMPTY)
            }
          }
        } else {
          if (start == 0 && end == null) {
            lineModel.setContent(newValue)
          } else {
            lineModel.setContent(
              // @ts-ignore
              lineModel.content.slice(0, start) + newValue + lineModel.content.slice(end ?? lineModel.content.length)
            )
            // @ts-ignore
            if (!lineModel.content.trim()) {
              lineModel.setContent(EMPTY)
            }
          }
        }
      })
    }
    return next()
  }
}
