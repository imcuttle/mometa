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

    injectGlobal(`
    body {
    padding: 20px 10px;
    }
  `)
  }
}
