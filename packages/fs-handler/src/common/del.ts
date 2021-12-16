import { Middleware, OpType } from '../index'
import { EMPTY } from '../utils/line-contents'
import replaceNodeMiddleware from './replace-node'

export default function delMiddleware(): Middleware {
  return async (data, ctx, next) => {
    if (data.type === OpType.DEL) {
      return replaceNodeMiddleware()(
        {
          type: OpType.REPLACE_NODE,
          preload: {
            ...data.preload,
            data: {
              newText: ''
            }
          }
        },
        ctx,
        next
      )
    }
    return next()
  }
}
