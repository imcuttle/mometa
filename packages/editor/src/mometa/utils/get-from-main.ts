import { useBehaviorSubject } from '@rcp/use.behaviorsubject'
import { getByRemoteById } from '../../shared/pipe'

export function getSharedFromMain() {
  const shared = getByRemoteById('shared', 'main')
  if (!shared) {
    throw new Error(`未找到来自父窗口共享资源`)
  }
  return shared
}

export function useSelectedNode() {
  const { selectedNodeSubject } = getSharedFromMain()
  return useBehaviorSubject(selectedNodeSubject)
}

export function useOveringNode() {
  const { overingNodeSubject } = getSharedFromMain()
  return useBehaviorSubject(overingNodeSubject)
}

export function useHeaderStatus() {
  const { headerStatusSubject } = getSharedFromMain()
  return useBehaviorSubject<any>(headerStatusSubject)
}

export function useLocationAction() {
  const { locationActionSubject } = getSharedFromMain()
  return useBehaviorSubject(locationActionSubject)
}
