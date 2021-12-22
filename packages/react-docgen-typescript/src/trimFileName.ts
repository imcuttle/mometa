import * as path from 'path'

const slashRegex = /[\\/]/g

export function trimFileName(fileName: string, cwd: string = process.cwd(), platform?: 'posix' | 'win32') {
  // This allows tests to run regardless of current platform
  const pathLib = platform ? path[platform] : path

  // Typescript formats Windows paths with forward slashes. For easier use of
  // the path utilities, normalize to platform-standard slashes, then restore
  // the original slashes when returning the result.
  const originalSep = fileName.match(slashRegex)?.[0] || pathLib.sep
  const normalizedFileName = pathLib.normalize(fileName)
  const root = pathLib.parse(cwd).root

  // Walk up paths from the current directory until we find a common ancestor,
  // and return the path relative to that. This will work in either a single-
  // package repo or a monorepo (where dependencies may be installed at the
  // root, but commands may be run in a package folder).
  let parent = cwd
  do {
    if (normalizedFileName.startsWith(parent)) {
      return (
        pathLib
          // Preserve the parent directory name to match existing behavior
          .relative(pathLib.dirname(parent), normalizedFileName)
          // Restore original type of slashes
          .replace(slashRegex, originalSep)
      )
    }
    parent = pathLib.dirname(parent)
  } while (parent !== root)

  // No common ancestor, so return the path as-is
  return fileName
}
