import * as babel from '@babel/core'

export function normalizeContent(code: string) {
  return babel
    .transformAsync(code, {
      parserOpts: {
        plugins: [
          'asyncDoExpressions',
          'asyncGenerators',
          'bigInt',
          'classPrivateMethods',
          'classPrivateProperties',
          'classProperties',
          'classStaticBlock',
          'decimal',
          'decorators-legacy',
          'doExpressions',
          'dynamicImport',
          'exportDefaultFrom',
          'exportNamespaceFrom',
          'functionBind',
          'functionSent',
          'importMeta',
          'jsx',
          'logicalAssignment',
          'importAssertions',
          'moduleBlocks',
          'moduleStringNames',
          'nullishCoalescingOperator',
          'numericSeparator',
          'objectRestSpread',
          'optionalCatchBinding',
          'optionalChaining',
          'throwExpressions',
          'topLevelAwait',
          'typescript'
        ]
      }
    })
    .then((x) => {
      return x.code
    })
}
