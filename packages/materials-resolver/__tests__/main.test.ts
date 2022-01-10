import { resolveLibMatConfig, resolveAsyncConfig } from '../src'
import { fixture } from './helper'

describe('materialsResolver', function () {
  it('resolveAsyncConfig', async function () {
    expect(
      await resolveAsyncConfig([
        Promise.resolve(1),
        Promise.resolve(2),
        {
          3: Promise.resolve(3)
        }
      ])
    ).toEqual([1, 2, { 3: 3 }])
  })
  it('resolveLibMatConfig valid', async function () {
    expect(await resolveLibMatConfig(fixture('mat-lib'))).toEqual([1, { x: 1, y: [1] }])
  })

  it('resolveLibMatConfig invalid', async function () {
    let error
    try {
      await resolveLibMatConfig(fixture('invalid-mat-lib'))
    } catch (e) {
      error = e
    }

    expect(error?.message).toMatch(`Cannot find module '${fixture('invalid-mat-lib', 'mometa.js')}'`)
  })
})
