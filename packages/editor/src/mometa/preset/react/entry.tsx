// @ts-nocheck
import { refresh } from '../../utils/emotion-css'
import { overingNodeSubject, selectedNodeSubject } from '@@__mometa-external/shared'

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

  // hmrManager.addMountListener(() => {
  //   // eslint-disable-next-line global-require
  //   require('react-dom').render = rawRender;
  // });

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
}
