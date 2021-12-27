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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const react_1 = __importStar(require('react'))
const react_dom_1 = __importDefault(require('react-dom'))
const react_router_dom_1 = require('react-router-dom')
const react_router_dom_2 = require('react-router-dom')
require('./styles.css')
const App_1 = __importDefault(require('./App'))
const ListPage_1 = __importDefault(require('./ListPage'))
const Navigation = () => {
  return react_1.default.createElement(
    'ul',
    null,
    react_1.default.createElement(
      'li',
      null,
      react_1.default.createElement(react_router_dom_2.Link, { to: '/list' }, 'ListPage')
    ),
    react_1.default.createElement(
      'li',
      null,
      react_1.default.createElement(react_router_dom_2.Link, { to: '/' }, 'App')
    )
  )
}
const rootElement = document.getElementById('root')
react_dom_1.default.render(
  react_1.default.createElement(
    react_1.StrictMode,
    null,
    react_1.default.createElement(
      react_router_dom_1.HashRouter,
      null,
      react_1.default.createElement(Navigation, null),
      react_1.default.createElement(
        react_router_dom_2.Routes,
        null,
        react_1.default.createElement(react_router_dom_2.Route, {
          path: '/',
          element: react_1.default.createElement(App_1.default, null)
        }),
        react_1.default.createElement(react_router_dom_2.Route, {
          path: '/list',
          element: react_1.default.createElement(ListPage_1.default, null)
        })
      )
    )
  ),
  rootElement
)
//# sourceMappingURL=index.js.map
