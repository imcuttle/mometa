'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.Panel = void 0
const react_1 = __importDefault(require('react'))
class Panel extends react_1.default.Component {
  render() {
    return (
      // @ts-ignore
      react_1.default.createElement(
        'panel',
        Object.assign({}, this.props),
        react_1.default.createElement('div', null, 'Panel Content'),
        react_1.default.createElement('h2', null, 'Panel Title')
      )
    )
  }
}
exports.Panel = Panel
//# sourceMappingURL=Panel.js.map
