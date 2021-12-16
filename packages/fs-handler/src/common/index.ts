import { Middleware } from '../index'
import commonDelMiddleware from './del'
import commonReplaceNodeMiddleware from './replace-node'
import moveNodeMiddleware from './move-node'
import insertNodeMiddleware from './insert-node'

export default function commonMiddlewares(): Middleware[] {
  return [commonDelMiddleware(), commonReplaceNodeMiddleware(), moveNodeMiddleware(), insertNodeMiddleware()]
}
