'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.panel = exports.body = void 0
const Panel_1 = require('./Panel')
const react_1 = __importDefault(require('react'))
const tabs_1 = __importDefault(require('antd/es/tabs'))
exports.body = react_1.default.createElement(
  react_1.default.Fragment,
  null,
  react_1.default.createElement('p', null, 'body '),
  react_1.default.createElement(
    'div',
    null,
    react_1.default.createElement(Panel_1.Panel, null),
    react_1.default.createElement('h3', null, 'h3')
  )
)
exports.panel = react_1.default.createElement(
  tabs_1.default.TabPane,
  { key: 'extra', tab: '其他' },
  react_1.default.createElement('p', null, 'extra')
)
//# sourceMappingURL=elements.js.map
