import { assert } from 'chai'
import { trimFileName } from '../trimFileName'

describe('trimFileName', () => {
  describe('posix', () => {
    const cwd = '/home/user/projects/react-docgen-typescript'
    const platform = 'posix'

    it('works with simple path', () => {
      const input = `${cwd}/src/__tests__/data/ExportsPropTypeImport.tsx`
      assert.equal(
        trimFileName(input, cwd, platform),
        'react-docgen-typescript/src/__tests__/data/ExportsPropTypeImport.tsx'
      )
    })

    it('works with repeated path segments', () => {
      const input = `${cwd}/react-docgen-typescript/src/__tests__/data/ExportsPropTypeImport.tsx`
      assert.equal(
        trimFileName(input, cwd, platform),
        'react-docgen-typescript/react-docgen-typescript/src/__tests__/data/ExportsPropTypeImport.tsx'
      )
    })

    it('preserves package name from node_modules', () => {
      const input = `${cwd}/node_modules/@types/react/index.d.ts`
      assert.equal(trimFileName(input, cwd, platform), 'react-docgen-typescript/node_modules/@types/react/index.d.ts')
    })

    it('preserves package name from node_modules in monorepo', () => {
      // This simulates running docgen in an individual package in a monorepo
      const monorepoCwd = cwd + '/packages/foo'
      const input = `${cwd}/node_modules/@types/react/index.d.ts`
      assert.equal(
        trimFileName(input, monorepoCwd, platform),
        'react-docgen-typescript/node_modules/@types/react/index.d.ts'
      )
    })

    it('returns full path if there is no common root', () => {
      const input = '/somewhere/else/foo.d.ts'
      assert.equal(trimFileName(input, cwd, platform), input)
    })

    it('works when run at the root directory', () => {
      // This is more of a theoretical edge case
      const input = `/src/__tests__/data/ExportsPropTypeImport.tsx`
      assert.equal(trimFileName(input, '/', platform), 'src/__tests__/data/ExportsPropTypeImport.tsx')
    })
  })

  describe('windows', () => {
    const cwd = 'C:\\Users\\user\\projects\\react-docgen-typescript'
    // typescript uses forward slashes even in windows paths
    const cwdForwardSlash = cwd.replace(/\\/g, '/')
    const platform = 'win32'

    it('works with simple path', () => {
      const input = `${cwdForwardSlash}/src/__tests__/data/ExportsPropTypeImport.tsx`
      assert.equal(
        trimFileName(input, cwd, platform),
        'react-docgen-typescript/src/__tests__/data/ExportsPropTypeImport.tsx'
      )
    })

    it('works with repeated path segments', () => {
      const input = `${cwdForwardSlash}/react-docgen-typescript/src/__tests__/data/ExportsPropTypeImport.tsx`
      assert.equal(
        trimFileName(input, cwd, platform),
        'react-docgen-typescript/react-docgen-typescript/src/__tests__/data/ExportsPropTypeImport.tsx'
      )
    })

    it('preserves package name from node_modules', () => {
      const input = `${cwdForwardSlash}/node_modules/@types/react/index.d.ts`
      assert.equal(trimFileName(input, cwd, platform), 'react-docgen-typescript/node_modules/@types/react/index.d.ts')
    })

    it('preserves package name from node_modules in monorepo', () => {
      const monorepoCwd = cwd + '\\packages\\foo'
      const input = `${cwdForwardSlash}/node_modules/@types/react/index.d.ts`
      assert.equal(
        trimFileName(input, monorepoCwd, platform),
        'react-docgen-typescript/node_modules/@types/react/index.d.ts'
      )
    })

    it('returns full path if there is no common root', () => {
      const input = 'D:/somewhere/else/foo.d.ts'
      assert.equal(trimFileName(input, cwd, platform), input)
    })

    it('works when run at the filesystem root', () => {
      const input = `C:/src/__tests__/data/ExportsPropTypeImport.tsx`
      assert.equal(trimFileName(input, 'C:\\', platform), 'src/__tests__/data/ExportsPropTypeImport.tsx')
    })

    it('works with backslashes', () => {
      // typescript uses forward slashes in file paths, but test with backslashes too
      const input = `${cwd}\\src\\__tests__\\data\\ExportsPropTypeImport.tsx`
      assert.equal(
        trimFileName(input, cwd, platform),
        'react-docgen-typescript\\src\\__tests__\\data\\ExportsPropTypeImport.tsx'
      )
    })
  })
})
