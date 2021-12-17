import { createReactBehaviorSubject } from '@rcp/use.behaviorsubject'

export const CLS_PREFIX = 'mometa-editor'

const { useSubject: useOveringNode, subject: overingNodeSubject } = createReactBehaviorSubject(null)
const { useSubject: useSelectedNode, subject: selectedNodeSubject } = createReactBehaviorSubject(null, {})

export { selectedNodeSubject, overingNodeSubject, useOveringNode, useSelectedNode }
