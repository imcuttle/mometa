import { createFsHandler, OpType, reactMiddlewares } from '../src'
import * as fs from 'fs'
import { fixture } from './helper'

const mockFs = {
  readFile: fs.readFile,
  writeFile: fs.writeFile
}

describe('fsHandler', function () {
  const raw = mockFs.writeFile
  let result
  beforeEach(() => {
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
    const fsHandler = createFsHandler({
      fs: mockFs,
      middlewares: reactMiddlewares()
    })

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
    const fsHandler = createFsHandler({
      fs: mockFs,
      middlewares: reactMiddlewares()
    })

    await fsHandler({
      type: OpType.REPLACE_NODE,
      preload: {
        newValue: '<span>ppp</span>',
        name: 'p',
        text: '<p>单独 p</p>',
        filename: fixture('react-comp.tsx'),
        start: { line: 18, column: 10 },
        end: { line: 18, column: 21 }
      }
    })
    expect(result).toMatchSnapshot()
  })
})
