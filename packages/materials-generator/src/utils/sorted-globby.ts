import globby from 'globby'
import * as fs from 'fs'
import * as nps from 'path'
import { toArray } from './to-array'

export async function sortedGlobby(patterns: string | string[], cwd?: string) {
  patterns = toArray(patterns) as string[]

  const ps: string[] = []
  const dirs: string[] = []
  patterns.forEach((dir) => {
    const dirPath = nps.resolve(cwd || '', dir)
    if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
      dirs.push(dirPath)
      return
    }
    ps.push(dir)
  })

  const files = await globby(ps, { cwd, onlyDirectories: true })
  const sortedDirs = files.sort((a, b) => a.localeCompare(b))
  return Array.from(new Set(dirs.concat(sortedDirs)).values())
}
