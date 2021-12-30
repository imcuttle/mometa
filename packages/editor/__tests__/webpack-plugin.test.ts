import { createFsFromVolume, Volume } from 'memfs'
import { promisify } from 'util'
import Plugin from '../webpack'
import { fixture } from './helper'

const getWebpack = (version: any = '') => {
  return require('webpack')
}

const getConfig = () => {
  return {
    mode: 'development',
    context: fixture('webpack'),
    entry: './src/index.js',
    plugins: [
      new Plugin({
        server: false,
        react: true
      })
    ]
  } as any
}

const run = async (version: any = '') => {
  const memFs = createFsFromVolume(new Volume())
  const webpack = getWebpack(version)
  const compiler = webpack(getConfig())
  compiler.webpack = webpack
  compiler.outputFileSystem = memFs
  const stats = await promisify(compiler.run.bind(compiler))()
  return stats
}

jest.setTimeout(1000 * 60)
describe('editor webpack plugin', function () {
  it('webpack5', async function () {
    const stats = await run()
    expect(Object.keys(stats.compilation.getAssets())).toMatchObject(['mometa/index.html'])
  })
})
