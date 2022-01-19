// @ts-ignore
import { getByRemoteOnce, getInLocal } from './pipe'

export function addUpdateCallbackListener(fn) {
  var RefreshUtils = getByRemoteOnce('RefreshUtils') ?? getInLocal('RefreshUtils')
  if (!RefreshUtils) {
    throw new Error('没有找到 RefreshUtils')
  }
  RefreshUtils?.eventEmitter?.on('updateCallback', fn)
  return () => {
    RefreshUtils?.eventEmitter?.off('updateCallback', fn)
  }
}

export function addExecuteRuntimeListener(fn) {
  var RefreshUtils = getByRemoteOnce('RefreshUtils') ?? getInLocal('RefreshUtils')
  if (!RefreshUtils) {
    throw new Error('没有找到 RefreshUtils')
  }
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
