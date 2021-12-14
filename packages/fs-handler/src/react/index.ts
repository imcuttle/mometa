import { Middleware } from '../index'
import reactDelMiddleware from './del'
import reactReplaceNodeMiddleware from './replace-node'

export default function reactMiddlewares(): Middleware[] {
  return [reactDelMiddleware(), reactReplaceNodeMiddleware()]
}
