// 是 iframe 环境
import React from 'react'
import ReactDOM from 'react-dom'
import { BehaviorSubject } from 'rxjs'
import { useBehaviorSubject } from '@rcp/use.behaviorsubject'
import { injectGlobal } from './utils/emotion-css'
import { DndLayout } from './runtime/dnd'
import { addUpdateCallbackListener } from '../shared/hot'
import { getSharedFromMain } from './utils/get-from-main'
import { lazy } from '../shared/utils'
const { selectedNodeSubject } = getSharedFromMain()

injectGlobal(`
    body {
    padding: 30px 10px;
    }
`)

addUpdateCallbackListener((moduleExports, moduleId, webpackHot, refreshOverlay, isTest) => {
  // Update selectedNodeSubject for render
  const prev = selectedNodeSubject.value
  selectedNodeSubject.next(null)
  if (prev?.parentElement) {
    selectedNodeSubject.next(prev)
  }
})

const lazyDomGetter = lazy(() => {
  const doc = document.createElement('mometa-runtime')
  document.body.appendChild(doc)
  return doc
})
const lazyFloatingRender = lazy(() => {
  const doc = lazyDomGetter()
  ReactDOM.render(<DndLayoutManager />, doc)
})

const domSub = new BehaviorSubject<any[]>([])
function DndLayoutManager() {
  const [doms] = useBehaviorSubject(domSub)
  console.log('doms', doms)
  return (
    <>
      {doms?.map((dom, i) => (
        <DndLayout dom={dom} key={i} />
      ))}
    </>
  )
}

const rawRender = require('$mometa-external:react-dom').render
// @ts-ignore
require('$mometa-external:react-dom').render = function _render(...argv) {
  const [elem, dom, cb] = argv
  return rawRender.apply(this, [
    elem,
    dom,
    function () {
      setTimeout(() => {
        if (dom !== lazyDomGetter()) {
          lazyFloatingRender()
          domSub.next(Array.from(new Set(domSub.value.concat(dom)).values()).filter((x) => x && x.parentElement))
        }
      })
      return cb?.apply(this, arguments)
    }
  ])
}
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
