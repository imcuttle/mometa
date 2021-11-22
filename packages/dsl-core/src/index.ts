/**
 * DSL 的 parser &amp; stringify
 * @author 余聪
 */
import { ModuleNode } from './type'
import { parse, parseExpression } from '@babel/parser'

interface CommonOptions {
  plugins?: any[]
}
interface ParseOptions extends CommonOptions {
  id?: ModuleNode['id']
}
interface StringifyOptions extends CommonOptions {}

export function parseModuleNode(moduleCode: string, { id = null }: ParseOptions = {}): ModuleNode {
  return {
    type: 'module',
    id,
    imports: [],
    body: [],
    exports: []
  }
}

export function stringifyModuleNode(moduleNode: ModuleNode, opts?: StringifyOptions): { code: string } {
  return { code: '' }
}
