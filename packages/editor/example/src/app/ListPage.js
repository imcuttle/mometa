'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const react_1 = __importDefault(require('react'))
const antd_1 = require('antd')
require('antd/lib/input/style/css')
function ListPage(props) {
  return react_1.default.createElement(
    react_1.default.Fragment,
    null,
    react_1.default.createElement('h1', { title: 'abc' }, 'ListPage'),
    react_1.default.createElement(antd_1.Input, { placeholder: '\u8BF7\u8F93\u5165' })
  )
}
exports.default = ListPage
//# sourceMappingURL=ListPage.js.map
