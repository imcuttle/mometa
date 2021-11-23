import { parseModuleNode } from '../src'

describe('dslCore', function () {
  it('spec case', function () {
    parseModuleNode(
      `
      import React from 'react'

      export default function App() {
        return null
      }
      `
    )
  })
})
