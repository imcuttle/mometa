// @ts-nocheck

// 是 iframe 环境
import { addUpdateCallbackListener } from '../../../shared/hot'
import { injectGlobal } from '../../utils/emotion-css'

if (require('@@__mometa-external/shared')) {
  const { refresh } = require('../../utils/emotion-css')
  const { overingNodeSubject, selectedNodeSubject } = require('@@__mometa-external/shared')

  refresh()
  overingNodeSubject.next(null)
  selectedNodeSubject.next(null)
  injectGlobal(`
    body {
    padding: 30px 10px;
    }
  `)

  const React = require('@@__mometa-external/react')
  const { RootProvider } = require('@@__mometa-external/shared')
  const { DndLayout } = require('./runtime/dnd-utils')

  if (!global.__MOMETA_INITIALIZED__) {
    global.__MOMETA_INITIALIZED__ = true

    // eslint-disable-next-line global-require
    const rawRender = require('@@__mometa-external/react-dom').render
    // eslint-disable-next-line no-unused-expressions
    require('@@__mometa-external/react-dom').render = function _render(...argv) {
      const [elem, dom, cb] = argv
      return rawRender.apply(this, [
        <RootProvider>
          <DndLayout dom={dom}>{elem}</DndLayout>
        </RootProvider>,
        dom,
        cb
      ])
    }

    // Hot
    addUpdateCallbackListener((moduleExports, moduleId, webpackHot, refreshOverlay, isTest) => {
      const { selectedNodeSubject } = require('@@__mometa-external/shared')
      // Update selectedNodeSubject for render
      const prev = selectedNodeSubject.value
      selectedNodeSubject.next(null)
      if (prev?.parentElement) {
        selectedNodeSubject.next(prev)
      }
    })

    if (__mometa_env_react_jsx_runtime__ && process.env.NODE_ENV !== 'production') {
      const JSXDEVRuntime = require('react/jsx-dev-runtime')
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
  }
}
