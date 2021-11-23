/**
 * DSL 的 parser &amp; stringify
 * @author 余聪
 */
import { ModuleNode } from './type'
import { transformAsync, TransformOptions } from '@babel/core'
import { createMetaPlugins } from './plugins/pluggable'

interface CommonOptions {
  plugins?: TransformOptions['plugins']
}
interface ParseOptions extends CommonOptions {
  id?: ModuleNode['id']
}
interface StringifyOptions extends CommonOptions {}

export async function parseModuleNode(
  moduleCode: string,
  { id = null, plugins }: ParseOptions = {}
): Promise<ModuleNode> {
  const plgMan = createMetaPlugins(plugins)
  const x = await transformAsync(moduleCode, {
    parserOpts: {
      plugins: [
        'jsx',
        // 'flow',
        'typescript',

        'asyncGenerators',
        'bigInt',
        'classProperties',
        'classPrivateProperties',
        'classPrivateMethods',
        'decorators-legacy',
        'doExpressions',
        'dynamicImport',
        'exportDefaultFrom',
        'exportNamespaceFrom',
        'functionBind',
        'functionSent',
        'importMeta',
        'logicalAssignment',
        'nullishCoalescingOperator',
        'numericSeparator',
        'objectRestSpread',
        'optionalCatchBinding',
        'optionalChaining',
        'partialApplication',
        // 'pipelineOperator',
        'throwExpressions',
        'topLevelAwait'
      ]
    },
    plugins: plgMan.plugins,
    babelrc: false,
    filename: id
  })
  console.log(x.metadata, x.metadata.modulePath)

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
