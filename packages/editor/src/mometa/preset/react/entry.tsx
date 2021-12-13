// @ts-nocheck
import { hmrManager } from './runtime/hmr-manager'

hmrManager.mount()

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
    // eslint-disable-next-line no-console
    console.log('render', { elem, dom })
    // eslint-disable-next-line no-console
    return rawRender.apply(this, [
      <RootProvider>
        <DndLayout dom={dom}>{elem}</DndLayout>
      </RootProvider>,
      dom,
      cb
    ])
  }
}
