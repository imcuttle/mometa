import { Middleware, OpType } from '../index'

export default function reactDelMiddleware(): Middleware {
  return async (data, ctx, next) => {
    if (data.type === OpType.DEL) {
      const content = await ctx.getContent()
      console.log('content', content)
      // data.preload.name
      return
    }
    return next()
  }
}
