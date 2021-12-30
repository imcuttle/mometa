const nps = require('path')
const fs = require('fs')
const runtimeJsPath = nps.join(__dirname, '../../build/runtime-entry/index.js')

const content = fs.readFileSync(runtimeJsPath, 'utf-8')
if (content.includes('__webpack_require_mometa__')) {
  return
}

fs.writeFileSync(runtimeJsPath, content.replace(/__webpack_require__/g, '__webpack_require_mometa__'))
console.log('done! __webpack_require__ rename')
