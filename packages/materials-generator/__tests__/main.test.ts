import { materials, resolveLibMatConfig } from '../src'
import { fixture } from './helper'

describe('materialsGenerator', function () {
  it.skip('spec case', async function () {
    const x = await materials(fixture('deep'))
    expect(x).toMatchSnapshot()
  })

  it('resolveLibMatConfig', async function () {
    expect(await resolveLibMatConfig(fixture('mat-lib'))).toMatchInlineSnapshot(`
      Array [
        1,
        Object {
          "x": 1,
          "y": Array [
            1,
          ],
        },
      ]
    `)
  })

  it('resolveLibMatConfig invalid', async function () {
    let error
    try {
      await resolveLibMatConfig(fixture('invalid-mat-lib'))
    } catch (e) {
      error = e
    }

    expect(error.message).toMatch(`Cannot find module '${fixture('invalid-mat-lib', 'mometa.js')}'`)
  })
})

// describe('reactComponentAsset', function () {
//   it('spec case', async function () {
//     // const x = await reactComponentAsset(fixture('my-comp/alert/index.tsx'))
//     // const x = await reactComponentAsset(fixture('antd/alert/index.d.ts'))
//     // expect(x).toMatchSnapshot()
//   })
// })
