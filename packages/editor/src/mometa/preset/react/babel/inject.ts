/**
 * <Comp /> => <Comp __mometa={{ start: {line: 100, column: 11}, end: {}, text: '<Comp />' }}/>
 */
import { PluginObj, PluginPass } from '@babel/core'
import templateBuilder from '@babel/template'
import { addDefault } from '@babel/helper-module-imports'
import { sha1 as hash } from 'object-hash'

export default function babelPluginMometaReactInject(api) {
  const { types: t } = api

  return {
    name: 'babel-plugin-mometa-react-inject',
    pre(state) {
      this.cache = new WeakSet()
    },
    post(state) {
      this.cache = null
    },
    visitor: {
      Program: {
        enter(path, state: any) {
          const visitor = {
            JSXElement: {
              enter(path) {
                if (this.cache.has(path.node)) {
                  return
                }
                const openingElement = path.get('openingElement')
                if (!openingElement) {
                  return
                }

                const existingProp = openingElement.node.attributes.find((node: any) => node.name?.name === '__mometa')
                if (existingProp) {
                  return
                }

                const jsxExpContainerPath = path.findParent((pPath) => pPath.isJSXExpressionContainer())

                const mometaData = {
                  ...path.node.loc,
                  name: openingElement.get('name')?.toString(),
                  text: path.toString(),
                  filename: this.filename,
                  emptyChildren: !path.node.children?.length
                } as MometaData

                mometaData.hash = hash(mometaData)
                if (jsxExpContainerPath) {
                  const container = {
                    text: jsxExpContainerPath.toString()
                  }
                  mometaData.container = {
                    ...container,
                    hash: hash(container)
                  }
                }

                const objExp = templateBuilder.expression(JSON.stringify(mometaData))()

                const newProp = t.JSXAttribute(t.JSXIdentifier('__mometa'), t.JSXExpressionContainer(objExp))

                openingElement.node.attributes.push(newProp)

                if (!path.node.children?.length) {
                  const emptyChildrenPlc =
                    this.emptyChildrenPlc ||
                    (this.emptyChildrenPlc = addDefault(
                      path,
                      state.opts.emptyPlaceholderPath || require.resolve('../runtime/empty-placeholder'),
                      {
                        nameHint: 'MometaEmptyPlaceholder'
                      }
                    ))
                  if (!path.node.closingElement) {
                    // @ts-ignore
                    path.node.closingElement = t.JSXClosingElement(t.cloneDeep(path.node.openingElement.name))
                  }

                  const childNode = templateBuilder.expression(`<${emptyChildrenPlc.name} />`, {
                    plugins: ['jsx']
                  })() as any
                  childNode.openingElement.attributes.push(t.cloneDeep(newProp))
                  this.cache.add(childNode)

                  path.node.children.push(childNode)
                }
              }
            }
          }

          path.traverse(visitor, state)
        }
      }
    }
  } as PluginObj<PluginPass & { cache: WeakSet<any> }>
}
