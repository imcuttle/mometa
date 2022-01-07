import { createReactBehaviorSubject } from '@rcp/use.behaviorsubject'

export const CLS_PREFIX = 'mometa-editor'

const { useSubject: useOveringNode, subject: overingNodeSubject } = createReactBehaviorSubject(null)
const { useSubject: useSelectedNode, subject: selectedNodeSubject } = createReactBehaviorSubject(null, {})
const { useSubject: useIframeWindows, subject: iframeWindowsSubject } = createReactBehaviorSubject<
  Array<typeof window>
>([])
const { useSubject: useLocationAction, subject: locationActionSubject } = createReactBehaviorSubject<{
  action: 'PUSH' | 'REPLACE'
  url?: string
  data?: any
  // 来自外部的改动？
  outer?: boolean
}>(null, {
  eq: (a, b) => a === b
})

export {
  selectedNodeSubject,
  overingNodeSubject,
  useOveringNode,
  useSelectedNode,
  locationActionSubject,
  useLocationAction,
  iframeWindowsSubject,
  useIframeWindows
}
