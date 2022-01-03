/**
 * <Comp /> => <Comp __mometa={{ start: {line: 100, column: 11}, end: {}, text: '<Comp />' }}/>
 */
import { PluginObj, PluginPass, NodePath } from '@babel/core'
import templateBuilder from '@babel/template'
import { addDefault } from '@babel/helper-module-imports'
import { createLineContentsByContent } from '@mometa/fs-handler'
import { sha1 as hash } from 'object-hash'
import * as nps from 'path'

const scopePath = nps.resolve(__dirname, '../../')

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
          if (!this.filename || this.filename.startsWith(scopePath)) {
            return
          }

          const rawCode = this.file.code
          const lineContents = createLineContentsByContent(rawCode, { filename: this.filename })
          const getText = ({ start, end }) => {
            const arr = lineContents.locateByRange({
              start,
              end
            })
            return arr
              .map(({ lineNumber, line, start, end }) => {
                return line.toString()
              })
              .join('\n')
          }

          const visitor = {
            JSXExpressionContainer() {
              /**
               * <div>
               *   {element}
               * </div>
               */
            },
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
                  // @ts-ignore
                  name: openingElement.get('name')?.node && getText(openingElement.get('name')?.node.loc),
                  text: getText(path.node.loc),
                  filename: this.filename,
                  relativeFilename: nps.relative(state.cwd || '', this.filename),
                  emptyChildren: !path.node.children?.length,
                  isFirst: !['JSXElement', 'JSXFragment'].includes(path.parentPath.node.type),
                  selfClosed: !path.node.closingElement,
                  innerStart: openingElement.node.loc.end,
                  innerEnd: path.get('closingElement')?.node?.loc?.start
                } as MometaData

                mometaData.hash = hash(mometaData, { algorithm: 'md5', encoding: 'base64' })
                if (jsxExpContainerPath) {
                  const container = {
                    text: getText(jsxExpContainerPath.node.loc),
                    ...jsxExpContainerPath.node.loc
                  }
                  let isFirstElement = false
                  jsxExpContainerPath.traverse({
                    JSXElement(_path) {
                      isFirstElement = _path === path
                      _path.stop()
                    }
                  })
                  mometaData.container = {
                    isFirstElement,
                    ...container,
                    hash: hash({ ...container, filename: this.filename }, { algorithm: 'md5', encoding: 'base64' })
                  }
                }

                /**
                 * <div>
                 *   <p>1</p>
                 *   <p>2</p>
                 * </div>
                 *
                 * <Render>
                 *   {() => <p>
                 *     <div>1</div>
                 *     <div>2</div>
                 *   </p>}
                 *   {<p>2</p>}
                 *   <p>3</p>
                 *   123
                 * </Render>
                 */
                const parentPath = path.findParent(
                  (pPath) => pPath !== path && (pPath.isJSXElement() || pPath.isJSXFragment())
                )
                if (parentPath) {
                  const childrenPath = ((parentPath.get('children') as NodePath[]) ?? []).filter(
                    (p: NodePath) =>
                      p.isJSXElement() ||
                      p.isJSXExpressionContainer() ||
                      (p.isJSXText() && !!(p.node.extra.raw as string).trim())
                  ) as NodePath[]
                  const index = childrenPath.findIndex((childPath) => {
                    if (childPath === path) return true
                    let f = false
                    childPath.traverse({
                      JSXElement(_path) {
                        if (_path === path) {
                          f = true
                          _path.stop()
                        }
                      }
                    })
                    return f
                  })

                  if (index >= 0) {
                    const prevPath = childrenPath[index - 1]
                    if (prevPath) {
                      mometaData.previousSibling = {
                        ...prevPath.node.loc,
                        text: getText(prevPath.node.loc)
                      }
                    }
                    const nextPath = childrenPath[index + 1]
                    if (nextPath) {
                      mometaData.nextSibling = {
                        ...nextPath.node.loc,
                        text: getText(nextPath.node.loc)
                      }
                    }
                  }
                }

                const objExp = templateBuilder.expression(JSON.stringify(mometaData))()
                const newProp = t.JSXAttribute(t.JSXIdentifier('__mometa'), t.JSXExpressionContainer(objExp))
                openingElement.node.attributes.push(newProp)

                if (!path.node.children?.length && path.node.closingElement) {
                  const emptyChildrenPlc =
                    this.emptyChildrenPlc ||
                    (this.emptyChildrenPlc = addDefault(
                      path,
                      state.opts.emptyPlaceholderPath ||
                        (!!process.env.__MOMETA_LOCAL__
                          ? require.resolve('../../mometa/runtime/empty-placeholder')
                          : require.resolve('../../../build/runtime/empty-placeholder')),
                      {
                        nameHint: 'MometaEmptyPlaceholder'
                      }
                    ))

                  const childNode = templateBuilder.expression(`<${emptyChildrenPlc.name} />`, {
                    plugins: ['jsx']
                  })() as any
                  childNode.openingElement.attributes.push(t.cloneDeep(newProp))
                  this.cache.add(childNode)

                  path.node.children.push(childNode)
                }
              }
            }
          } as PluginObj<PluginPass & { cache: WeakSet<any> }>['visitor']

          path.traverse(visitor, state)
        }
      }
    }
  } as PluginObj<PluginPass & { cache: WeakSet<any> }>
}
