import { Middleware } from '../index'
import reactDelMiddleware from './del'

export default function reactMiddlewares(): Middleware[] {
  return [reactDelMiddleware()]
}
