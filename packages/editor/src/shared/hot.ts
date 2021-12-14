import { mometaRequire } from './mometa-require'

export function addUpdateCallbackListener(fn) {
  var RefreshUtils = mometaRequire('@mometa/react-refresh-webpack-plugin/lib/runtime/RefreshUtils') as any
  RefreshUtils.eventEmitter.on('updateCallback', fn)
  return () => {
    RefreshUtils.eventEmitter.off('updateCallback', fn)
  }
}
