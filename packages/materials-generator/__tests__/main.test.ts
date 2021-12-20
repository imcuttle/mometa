import { materials } from '../src'
import { fixture } from './helper'

describe('materialsGenerator', function () {
  it('spec case', async function () {
    const x = await materials(fixture('deep'))
    expect(x).toMatchSnapshot()
  })
})
