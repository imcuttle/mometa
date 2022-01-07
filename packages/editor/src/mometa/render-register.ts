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
