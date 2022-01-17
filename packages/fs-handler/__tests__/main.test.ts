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
            code: '<Button type="default">按钮</Button>',
            dependencies: {
              Button: {
                source: 'antd',
                mode: 'named'
              }
            }
          }
        }
      }
    })
    expect(result).toMatchSnapshot()
  })

  it('INSERT_NODE material existed name', async function () {
    await fsHandler({
      type: OpType.INSERT_NODE,
      preload: {
        text: '<p>单独 p</p>',
        filename: fixture('react-comp.tsx'),
        to: { line: 18, column: 10 },
        data: {
          material: {
            code: '<Tabs><Tabs.Panel></Tabs.Panel></Tabs>',
            dependencies: {
              Tabs: {
                source: 'antd',
                mode: 'named'
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
      <Antd />
      <Button type="default">按钮</Button>
    </>
    `.trim(),
          dependencies: {
            Button: {
              source: 'antd',
              mode: 'named'
            },
            Antd: {
              source: 'antd',
              mode: 'default'
            }
          } as any,
          sideEffectDependencies: ['antd/lib/button/style', 'antd/lib/button/style/css']
        }
      )
      expect(ops).toMatchSnapshot()
    })

    it('spec cjs', async function () {
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
      <Antd />
      <Button type="default">按钮</Button>
    </>
    `.trim(),
          dependencies: {
            Button: {
              source: 'antd',
              mode: 'named'
            },
            Antd: {
              source: 'antd',
              mode: 'default'
            }
          } as any,
          sideEffectDependencies: ['antd/lib/button/style', 'antd/lib/button/style/css']
        },
        { esModule: false }
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
      <Antd />
      <Button type="default">按钮</Button>
    </>
    `.trim(),
              dependencies: {
                Button: {
                  source: 'antd',
                  mode: 'named'
                },
                Antd: {
                  source: 'antd',
                  mode: 'default'
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
      <Antd />
      <Button type="default">按钮</Button>
    </>
    `.trim(),
              dependencies: {
                Button: {
                  source: 'antd',
                  mode: 'named'
                },
                Antd: {
                  source: 'antd',
                  mode: 'default'
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
