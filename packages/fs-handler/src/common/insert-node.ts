import { Middleware, OpType } from '../index'
import { comparePoint } from '../utils/compare'
import { getAddMaterialOps } from './add-material'

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
      let lineChars = line.toChars()

      const insertContent = async () => {
        if (newText) {
          lineChars.insert(toPos.column, newText)
        } else if (material) {
          const ops = await getAddMaterialOps(ctx.lineContents, toPos, material)
          await ctx.runLoop(ops.insertDeps as any, ctx)
          if (ops.insertCode) {
            // @ts-ignore
            lineChars.insert(toPos.column, ops.insertCode.preload.data?.newText)
          }
        }
      }

      if (wrap) {
        const { startStr = '', endStr = '', anotherTo } = wrap
        const anotherLine = ctx.lineContents.locateLineByPos(anotherTo.line)
        const anotherChars = anotherLine === line ? lineChars : anotherLine.toChars()

        const flag = comparePoint(toPos, anotherTo)
        if (flag > 0) {
          lineChars.insert(toPos.column, endStr)
          await insertContent()
          anotherChars.insert(anotherTo.column, startStr)
        } else {
          anotherChars.insert(anotherTo.column, endStr)
          await insertContent()
          lineChars.insert(toPos.column, startStr)
        }
        anotherLine.setContent(anotherChars.toString())
      } else {
        await insertContent()
      }

      line.setContent(lineChars.toString())
      // line.setContent(line.slice(0, toPos.column).content + newText + line.slice(toPos.column ?? Infinity).content)
    }
    return next()
  }
}
