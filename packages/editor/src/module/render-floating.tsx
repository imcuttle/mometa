import ReactDOM from 'react-dom'
import React from 'react'
import { useBehaviorSubject } from '@rcp/use.behaviorsubject'

import { DndLayout } from '../mometa/runtime/dnd'
import { iframeWindowsSubject } from './config/const'

export const floatingRender = (container) => {
  ReactDOM.render(<DndLayoutManager />, container)
  return () => {
    ReactDOM.unmountComponentAtNode(container)
  }
}

export function DndLayoutManager() {
  const [wins] = useBehaviorSubject(iframeWindowsSubject)
  const doms = React.useMemo(() => {
    return wins?.map((w) => w.document.body).filter((x) => x && x.parentNode)
  }, [wins])

  return (
    <>
      {doms?.map((dom, i) => (
        <DndLayout dom={dom} key={i} />
      ))}
    </>
  )
}
