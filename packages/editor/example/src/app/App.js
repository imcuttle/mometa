'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const react_1 = __importDefault(require('react'))
const tabs_1 = __importDefault(require('antd/es/tabs'))
require('antd/es/tabs/style/index.css')
const elements_1 = require('./elements')
const Panel_1 = require('./Panel')
const array = new Array(100).fill(1)
function App(props) {
  return react_1.default.createElement(
    'div',
    null,
    react_1.default.createElement('h1', { title: 'abc' }, 'Hello World\uD83D\uDC4C'),
    react_1.default.createElement('p', { className: 'empty' }),
    react_1.default.createElement(
      tabs_1.default,
      null,
      react_1.default.createElement(
        tabs_1.default.TabPane,
        { key: 'tool', tab: '物料' },
        elements_1.body,
        react_1.default.createElement('p', { className: 'empty' }),
        react_1.default.createElement(Panel_1.Panel, null),
        react_1.default.createElement(
          'div',
          { style: { display: 'flex' } },
          react_1.default.createElement('div', { style: { flex: 1, background: '#c7e29c' } }, 'cell2'),
          react_1.default.createElement('div', { style: { flex: 1, background: '#b39dde' } }, 'cell1')
        ),
        react_1.default.createElement('p', null, 'simple 66xxxxxasdasdas6'),
        react_1.default.createElement('p', null, 'nested', react_1.default.createElement('strong', null, 'hahahax')),
        array.map((x, i) =>
          react_1.default.createElement(
            'p',
            { key: i },
            react_1.default.createElement('div', null, '\u7269\u6599_a_zzb', i),
            react_1.default.createElement('div', null, '\u7269\u6599_b_', i)
          )
        )
      ),
      react_1.default.createElement(tabs_1.default.TabPane, { key: 'attr', tab: '属性' }),
      elements_1.panel
    )
  )
}
exports.default = App
//# sourceMappingURL=App.js.map
