const nps = require('path')
const fs = require('fs')
const globby = require('globby')
const runtimePath = nps.join(__dirname, '../../build/runtime/')

const jsPaths = globby.sync('**/*.js', { cwd: runtimePath, absolute: true, onlyFiles: true })

jsPaths.forEach((runtimeJsPath) => {
  const content = fs.readFileSync(runtimeJsPath, 'utf-8')
  if (content.includes('__webpack_require_mometa__')) {
    return
  }

  // 修复 webpack chunk 模式下，__webpack_require__ 命名冲突问题
  fs.writeFileSync(runtimeJsPath, content.replace(/__webpack_require__/g, '__webpack_require_mometa__'))
})
console.log('done! __webpack_require__ rename', jsPaths)
