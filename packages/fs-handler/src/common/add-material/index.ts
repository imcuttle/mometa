import { NodePath, PluginObj, Visitor, transformAsync } from '@babel/core'
import groupBy from 'lodash.groupby'
import escapeString from 'escape-string-regexp'
import { InsertNodePreload, OpType, Point, RequestData } from '../../index'
import { createLineContentsByContent, LineContents, Range } from '../../utils/line-contents'

const sideEffectImportVisitor = {
  ImportDeclaration(path, state) {
    if (!path.get('specifiers')?.length) {
      state.result.set(path.get('source').node.value, path)
    }
    state.startImportLoc = state.startImportLoc ?? path.node.loc
    state.endImportLoc = path.node.loc
    path.skip()
  }
} as Visitor<SideEffectImportVisitorState>

type SideEffectImportVisitorState = { result: Map<string, NodePath>; startImportLoc: Range; endImportLoc: Range }

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>
}

const importPlugin = ({ t }) =>
  ({
    visitor: {
      Program(path, state) {
        const { material, pos, ops } = state.opts

        const sideEffectImportVisitorState = {
          result: new Map(),
          endImportLoc: { end: { line: 1, column: 0 }, start: { line: 1, column: 0 } }
        } as SideEffectImportVisitorState
        path.traverse(sideEffectImportVisitor, sideEffectImportVisitorState)
        if (material.sideEffectDependencies) {
          material.sideEffectDependencies.forEach((depName) => {
            if (!sideEffectImportVisitorState.result.has(depName)) {
              ops.insertDeps.push({
                type: OpType.INSERT_NODE,
                preload: {
                  to: sideEffectImportVisitorState.endImportLoc.end,
                  data: {
                    newText: `;import ${JSON.stringify(depName)};`
                  }
                }
              })
            }
          })
        }

        if (material.dependencies && Object.keys(material.dependencies)?.length) {
          const map = new Map<string, { path?: NodePath; name: any; op?: any }>()
          for (const [name, binding] of Object.entries(path.scope.bindings)) {
            if (binding.kind === 'module') {
              const importDecPath = binding.path.findParent((x) => x.isImportDeclaration())
              if (importDecPath && (importDecPath.get('source') as any).node?.value) {
                const source = (importDecPath.get('source') as any).node?.value
                // @ts-ignore
                const imported = binding.path.node?.imported as any
                if (binding.path.isImportSpecifier() && (imported?.name ?? imported?.value) !== 'default') {
                  map.set(`${source}#named:${imported.name ?? imported.value}`, {
                    name: binding.path.node.local.name,
                    path: importDecPath
                  })
                } else if (
                  binding.path.isImportDefaultSpecifier() ||
                  (imported?.name ?? imported?.value) === 'default'
                ) {
                  map.set(`${source}#default`, {
                    // @ts-ignore
                    name: binding.path.node.local.name,
                    path: importDecPath
                  })
                } else if (binding.path.isImportNamespaceSpecifier()) {
                  map.set(`${source}#namespace`, {
                    name: binding.path.node.local.name,
                    path: importDecPath
                  })
                }
              }
            }
          }

          const namedCache = new Map()
          const getValidName = (name) => {
            name = name.replace(/[\/@]/g, '$')
            // @ts-ignore
            while (true === path.scope?.references?.[name] || namedCache.has(name)) {
              name = `_${name}`
            }
            namedCache.set(name, true)
            return name
          }

          const tplData = {}
          const list = Object.keys(material.dependencies).map((tplName) => ({
            ...material.dependencies[tplName],
            tplName
          }))
          const sourceMap = groupBy(list, 'source')
          for (const [source, dataList] of Object.entries(sourceMap)) {
            const modeMap = groupBy(dataList, (d) =>
              d.imported === 'default' || d.mode === 'default' ? 'default' : d.mode
            )
            for (const [mode, dataList] of Object.entries(modeMap)) {
              // @ts-ignore
              if (!dataList.length) return
              const cachedKey = `${source}#${mode}`
              const cached = map.get(cachedKey)
              if (mode === 'default') {
                if (cached?.name) {
                  tplData[dataList[0].tplName] = cached?.name
                } else {
                  const name = getValidName(dataList[0].local ?? dataList[0].imported ?? source)
                  map.set(cachedKey, { name })
                  tplData[dataList[0].tplName] = name
                  ops.insertDeps.push({
                    type: OpType.INSERT_NODE,
                    preload: {
                      to: sideEffectImportVisitorState.endImportLoc.end,
                      data: {
                        newText: `;import ${name} from ${JSON.stringify(source)};`
                      }
                    }
                  })
                }
              } else if (mode === 'namespace') {
                if (cached?.name) {
                  tplData[dataList[0].tplName] = cached?.name
                } else {
                  const name = getValidName(dataList[0].local ?? dataList[0].imported ?? source)
                  map.set(cachedKey, { name })
                  tplData[dataList[0].tplName] = name
                  ops.insertDeps.push({
                    type: OpType.INSERT_NODE,
                    preload: {
                      to: sideEffectImportVisitorState.endImportLoc.end,
                      data: {
                        newText: `;import * as ${name} from ${JSON.stringify(source)};`
                      }
                    }
                  })
                }
              } else if (mode === 'named') {
                const newNamedList = []
                ;(dataList as any).forEach((data) => {
                  const key = `${cachedKey}:${data.imported}`
                  const cached = map.get(key)
                  if (cached?.name) {
                    tplData[data.tplName] = cached?.name
                  } else {
                    const name = getValidName(data.local ?? data.imported)
                    map.set(key, { name })
                    tplData[data.tplName] = name
                    newNamedList.push(name)
                  }
                })

                if (newNamedList.length) {
                  ops.insertDeps.push({
                    type: OpType.INSERT_NODE,
                    preload: {
                      to: sideEffectImportVisitorState.endImportLoc.end,
                      data: {
                        newText: `;import { ${newNamedList.join(', ')} } from ${JSON.stringify(source)};`
                      }
                    }
                  })
                }
              }
            }
          }

          let newCode: string = material.code
          Object.keys(tplData).forEach((tplName) => {
            if (newCode) {
              newCode = newCode.replace(new RegExp(escapeString(`$${tplName}$`), 'g'), tplData[tplName])
            }
          })

          ops.insertCode = {
            type: OpType.INSERT_NODE,
            preload: {
              to: pos,
              data: {
                newText: newCode
              }
            }
          }
        }

        path.stop()
      }
    }
  } as PluginObj<{
    opts: {
      pos: Point
      material: InsertNodePreload['data']['material']
      lineContents: LineContents
      ops: {
        insertDeps: Array<DeepPartial<RequestData>>
        insertCode: DeepPartial<RequestData>
      }
    }
  }>)

export async function getAddMaterialOps(
  lineContents: LineContents,
  pos: Point,
  material: InsertNodePreload['data']['material']
) {
  const ops: {
    insertDeps: Array<RequestData>
    insertCode?: RequestData
  } = {
    insertDeps: [],
    insertCode: null
  }
  await transformAsync(lineContents.toString(false), {
    filename: lineContents.options?.filename,
    parserOpts: {
      plugins: [
        'jsx',
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
        'logicalAssignment',
        'importAssertions',
        'moduleBlocks',
        'moduleStringNames',
        'nullishCoalescingOperator',
        'numericSeparator',
        'objectRestSpread',
        'optionalCatchBinding',
        'optionalChaining',
        'partialApplication',
        'placeholders',
        'privateIn',
        'throwExpressions',
        'topLevelAwait',
        'typescript'
      ]
    },
    babelrc: false,
    plugins: [[importPlugin, { lineContents, material, pos, ops }]],
    ast: false,
    code: false
  })
  ;(ops.insertDeps.concat(ops.insertCode) as any).forEach((op) => {
    if (op?.preload && lineContents?.options) {
      op.preload.filename = lineContents?.options.filename
    }
  })

  return ops
}
