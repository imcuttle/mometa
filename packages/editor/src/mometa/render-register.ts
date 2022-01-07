// 是 iframe 环境
import { addUpdateCallbackListener } from '../shared/hot'
import { getSharedFromMain } from './utils/get-from-main'
const { iframeWindowsSubject, selectedNodeSubject, overingNodeSubject } = getSharedFromMain()

// const handleChanged = (v) => {
//   if (!document.body) {
//     return
//   }
//   const bodyCls = css`
//     padding: 30px 10px;
//   `
//   if (v?.canSelect) {
//     document.body.classList.add(bodyCls)
//   } else {
//     document.body.classList.remove(bodyCls)
//   }
// }
// headerStatusSubject.subscribe(handleChanged)
// handleChanged(headerStatusSubject.value)

selectedNodeSubject.next(null)
overingNodeSubject.next(null)

addUpdateCallbackListener((moduleExports, moduleId, webpackHot, refreshOverlay, isTest) => {
  // Update selectedNodeSubject for render
  const prev = selectedNodeSubject.value
  selectedNodeSubject.next(null)
  if (prev?.parentNode) {
    selectedNodeSubject.next(prev)
  }
})

setTimeout(() => {
  iframeWindowsSubject.next(iframeWindowsSubject.value.concat([window]))
})

// const rawRender = require('$mometa-external:react-dom').render
// // @ts-ignore
// require('$mometa-external:react-dom').render = function _render(...argv) {
//   const [elem, dom, cb] = argv
//   return rawRender.apply(this, [
//     elem,
//     dom,
//     function () {
//       return cb?.apply(this, arguments)
//     }
//   ])
// }

if (__mometa_env_react_jsx_runtime__ && __mometa_env_is_dev__) {
  const JSXDEVRuntime = require('$mometa-external:react/jsx-dev-runtime')
  const { jsxDEV } = JSXDEVRuntime
  // 转移 __mometa
  JSXDEVRuntime.jsxDEV = function _jsxDev() {
    let [type, props, key, isStaticChildren, source, ...rest] = arguments
    if (props?.__mometa) {
      const __mometa = props?.__mometa
      delete props?.__mometa
      source = {
        ...source,
        __mometa
      }
    }
    return jsxDEV.apply(this, [type, props, key, isStaticChildren, source, ...rest])
  }
}
