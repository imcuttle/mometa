import { materials } from '../src'
import { fixture } from './helper'

describe('materialsGenerator', function () {
  it.skip('spec case', async function () {
    const x = await materials(fixture('deep'))
    expect(x).toMatchSnapshot()
  })
})

// describe('reactComponentAsset', function () {
//   it('spec case', async function () {
//     // const x = await reactComponentAsset(fixture('my-comp/alert/index.tsx'))
//     // const x = await reactComponentAsset(fixture('antd/alert/index.d.ts'))
//     // expect(x).toMatchSnapshot()
//   })
// })
