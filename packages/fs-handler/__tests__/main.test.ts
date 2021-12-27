import { createFsHandler, OpType, commonMiddlewares, createLineContentsByContent } from '../src'
import * as fs from 'fs'
import { fixture, readContent } from './helper'
import { getAddMaterialOps } from '../src/common/add-material'

const mockFs = {
  readFile: fs.readFile,
  writeFile: fs.writeFile
}

describe('fsHandler', function () {
  const raw = mockFs.writeFile
  let result
  let fsHandler
  beforeEach(() => {
    fsHandler = createFsHandler({
      fs: mockFs,
      middlewares: commonMiddlewares()
    })
    // @ts-ignore
    Object.defineProperty(mockFs, 'writeFile', {
      value: (path, data, cb) => {
        result = data
        cb(null)
      },
      configurable: true
    })
  })
  afterEach(() => {
    mockFs.writeFile = raw
    result = null
  })

  it('spec case DEL', async function () {
    await fsHandler({
      type: OpType.DEL,
      preload: {
        name: 'p',
        text: '<p>单独 p</p>',
        filename: fixture('react-comp.tsx'),
        start: { line: 18, column: 10 },
        end: { line: 18, column: 21 }
      }
    })
    expect(result).toMatchSnapshot()
  })

  it('spec case REPLACE_NODE', async function () {
    await fsHandler({
      type: OpType.REPLACE_NODE,
      preload: {
        data: {
          newText: '<span>ppp</span>'
        },
        name: 'p',
        text: '<p>单独 p</p>',
        filename: fixture('react-comp.tsx'),
        start: { line: 18, column: 10 },
        end: { line: 18, column: 21 }
      }
    })
    expect(result).toMatchSnapshot()
  })

  it('nest REPLACE_NODE', async function () {
    await fsHandler({
      type: OpType.REPLACE_NODE,
      preload: {
        start: { line: 17, column: 10 },
        end: { line: 20, column: 14 },
        filename: fixture('nested.tsx'),
        name: 'p',
        text: '<p>\n            nested\n            <strong>hahahax</strong>\n          </p>',
        data: {
          newText: '<p>\n            nested 2\n            <strong>hahahax</strong>\n          </p>'
        }
      }
    })
    expect(result).toMatchSnapshot()
  })

  it('MOVE_NODE', async function () {
    await fsHandler({
      type: OpType.MOVE_NODE,
      preload: {
        text: '<p>单独 p</p>',
        filename: fixture('react-comp.tsx'),
        start: { line: 18, column: 10 },
        end: { line: 18, column: 21 },
        data: {
          to: {
            line: 17,
            column: 10
          }
        }
      }
    })
    expect(result).toMatchSnapshot()
  })

  it('INSERT_NODE', async function () {
    await fsHandler({
      type: OpType.INSERT_NODE,
      preload: {
        text: '<p>单独 p</p>',
        filename: fixture('react-comp.tsx'),
        to: { line: 18, column: 10 },
        data: {
          newText: '<p className="empty-2"></p>'
        }
      }
    })
    expect(result).toMatchSnapshot()
  })

  it('INSERT_NODE material', async function () {
    await fsHandler({
      type: OpType.INSERT_NODE,
      preload: {
        text: '<p>单独 p</p>',
        filename: fixture('react-comp.tsx'),
        to: { line: 18, column: 10 },
        data: {
          material: {
            code: '<ANT_BUTTON type="default">按钮</ANT_BUTTON>',
            dependencies: {
              ANT_BUTTON: {
                source: 'antd',
                mode: 'named',
                name: 'Button'
              }
            }
          }
        }
      }
    })
    expect(result).toMatchSnapshot()
  })

  it('INSERT_NODE wrap', async function () {
    await fsHandler({
      type: OpType.INSERT_NODE,
      preload: {
        text: '<p>单独 p</p>',
        filename: fixture('react-comp.tsx'),
        to: { line: 18, column: 10 },
        data: {
          wrap: {
            anotherTo: { line: 17, column: 10 },
            startStr: '<>',
            endStr: '</>'
          },
          newText: '<p className="empty-2"></p>'
        }
      }
    })
    expect(result).toMatchSnapshot()

    await fsHandler({
      type: OpType.INSERT_NODE,
      preload: {
        text: '<p>单独 p</p>',
        filename: fixture('react-comp.tsx'),
        to: { line: 17, column: 10 },
        data: {
          wrap: {
            anotherTo: { line: 18, column: 10 },
            startStr: '<>',
            endStr: '</>'
          },
          newText: '<p className="empty-2"></p>'
        }
      }
    })
    expect(result).toMatchSnapshot()

    await fsHandler({
      type: OpType.INSERT_NODE,
      preload: {
        text: '<p>单独 p</p>',
        filename: fixture('react-comp.tsx'),
        to: { line: 18, column: 10 },
        data: {
          wrap: {
            anotherTo: { line: 18, column: 10 },
            startStr: '<>',
            endStr: '</>'
          },
          newText: '<p className="empty-2"></p>'
        }
      }
    })
    expect(result).toMatchSnapshot()
  })

  describe('getAddMaterialOps', function () {
    it('spec', async function () {
      const lineContents = createLineContentsByContent(readContent('simple.tsx'), { filename: '/a.js' })

      const ops = await getAddMaterialOps(
        lineContents,
        {
          line: 6,
          column: 3
        },
        {
          code: `
    <>
      <$MY_COMP$ />
      <$ANT_BUTTON$ type="default">按钮</$ANT_BUTTON$>
    </>
    `.trim(),
          dependencies: {
            ANT_BUTTON: {
              source: 'antd',
              mode: 'named',
              imported: 'Button'
            },
            MY_COMP: {
              source: 'antd',
              mode: 'default',
              local: 'Antd'
            }
          } as any,
          sideEffectDependencies: ['antd/lib/button/style', 'antd/lib/button/style/css']
        }
      )
      expect(ops).toMatchSnapshot()
    })
    it('spec fsHandler', async function () {
      await fsHandler({
        type: OpType.INSERT_NODE,
        preload: {
          to: {
            line: 4,
            column: 18
          },
          filename: fixture('simple.tsx'),
          data: {
            material: {
              code: `
    <>
      <$MY_COMP$ />
      <$ANT_BUTTON$ type="default">按钮</$ANT_BUTTON$>
    </>
    `.trim(),
              dependencies: {
                ANT_BUTTON: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Button'
                },
                MY_COMP: {
                  source: 'antd',
                  mode: 'default',
                  local: 'Antd'
                }
              } as any,
              sideEffectDependencies: ['antd/lib/button/style', 'antd/lib/button/style/css']
            }
          }
        }
      })

      expect(result).toMatchSnapshot()
    })

    it('fsHandler', async function () {
      await fsHandler({
        type: OpType.INSERT_NODE,
        preload: {
          filename: fixture('react-comp.tsx'),
          to: { line: 18, column: 10 },
          data: {
            wrap: {
              anotherTo: { line: 18, column: 10 },
              startStr: '<>',
              endStr: '</>'
            },
            material: {
              code: `
    <>
      <$MY_COMP$ />
      <$ANT_BUTTON$ type="default">按钮</$ANT_BUTTON$>
    </>
    `.trim(),
              dependencies: {
                ANT_BUTTON: {
                  source: 'antd',
                  mode: 'named',
                  imported: 'Button'
                },
                MY_COMP: {
                  source: 'antd',
                  mode: 'default',
                  local: 'Antd'
                }
              } as any,
              sideEffectDependencies: ['antd/lib/button/style', 'antd/lib/button/style/css']
            }
          }
        }
      })
      expect(result).toMatchSnapshot()
    })
  })
})
