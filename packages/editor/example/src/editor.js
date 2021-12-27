'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const react_1 = __importDefault(require('react'))
const react_dom_1 = __importDefault(require('react-dom'))
const editor_1 = require('@mometa/editor/editor')
const antd_1 = require('antd')
function App() {
  // @ts-ignore
  const config = global.__mometa_editor_config__
  return react_1.default.createElement(editor_1.Editor, Object.assign({}, config))
}
antd_1.ConfigProvider.config({
  prefixCls: 'mmt-ant'
})
react_dom_1.default.render(
  react_1.default.createElement(react_1.default.StrictMode, null, react_1.default.createElement(App, null)),
  document.getElementById('root')
)
//# sourceMappingURL=editor.js.map
