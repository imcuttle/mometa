import { createFsHandler, OpType, commonMiddlewares } from '../src'
import * as fs from 'fs'
import { fixture } from './helper'

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
})
