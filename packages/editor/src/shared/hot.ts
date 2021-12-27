import { mometaRequire } from './mometa-require'

export function addUpdateCallbackListener(fn) {
  var RefreshUtils = mometaRequire('@mometa/react-refresh-webpack-plugin/lib/runtime/RefreshUtils') as any
  RefreshUtils?.eventEmitter?.on('updateCallback', fn)
  return () => {
    RefreshUtils?.eventEmitter?.off('updateCallback', fn)
  }
}

export function addExecuteRuntimeListener(fn) {
  var RefreshUtils = mometaRequire('@mometa/react-refresh-webpack-plugin/lib/runtime/RefreshUtils') as any

  const handler = function () {
    setTimeout(() => {
      fn.apply(this, arguments)
    }, 100)
  }
  RefreshUtils?.eventEmitter?.on('executeRuntime', handler)
  return () => {
    RefreshUtils?.eventEmitter?.off('executeRuntime', handler)
  }
}
