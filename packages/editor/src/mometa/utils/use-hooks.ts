import React from '@@__mometa-external/react'
import { pick } from 'lodash-es'

export function useStyle(style: CSSStyleDeclaration, dom: HTMLElement) {
  const styleKeys = React.useMemo(() => Object.keys(style), [style])
  React.useLayoutEffect(() => {
    const cachedStyle = pick(dom.style, styleKeys)
    Object.assign(dom.style, style)
    return () => {
      Object.assign(dom.style, cachedStyle)
    }
  }, [dom, styleKeys, style])
}
