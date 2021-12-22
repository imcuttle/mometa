'use strict'
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k]
          }
        })
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        o[k2] = m[k]
      })
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v })
      }
    : function (o, v) {
        o['default'] = v
      })
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod
    var result = {}
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k)
    __setModuleDefault(result, mod)
    return result
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.trimFileName = void 0
const path = __importStar(require('path'))
const slashRegex = /[\\/]/g
function trimFileName(fileName, cwd = process.cwd(), platform) {
  var _a
  // This allows tests to run regardless of current platform
  const pathLib = platform ? path[platform] : path
  // Typescript formats Windows paths with forward slashes. For easier use of
  // the path utilities, normalize to platform-standard slashes, then restore
  // the original slashes when returning the result.
  const originalSep = ((_a = fileName.match(slashRegex)) === null || _a === void 0 ? void 0 : _a[0]) || pathLib.sep
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
exports.trimFileName = trimFileName
//# sourceMappingURL=trimFileName.js.map
