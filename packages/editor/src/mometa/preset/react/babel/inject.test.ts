import { transform } from '@babel/core'
import babelPluginMometaReactInject from './inject'

describe('babel-inject', () => {
  it('spec', function () {
    const rs = transform(
      `
    const arr = new Array(100).fill(1)
    const elem = <div>
      <h1 title={'abc'}>Hello World</h1>
      <Tabs>
      <Tabs.TabPane key={'tool'} tab={'物料'}>
        <p>物料</p>
        {arr.map((x, i) => <p key={i}>content_{i}</p>)}
        <p className='empty'></p>
      </Tabs.TabPane>
      <Tabs.TabPane key={'attr'} tab={'属性'}></Tabs.TabPane>
      </Tabs>
    </div>
    `,
      {
        filename: '/file.jsx',
        cwd: '/',
        parserOpts: {
          plugins: ['jsx']
        },
        babelrc: false,
        plugins: [[babelPluginMometaReactInject, { emptyPlaceholderPath: 'empty' }]]
      }
    )

    expect(rs.code).toMatchSnapshot()
  })
})
