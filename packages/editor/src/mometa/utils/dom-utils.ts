import { pick } from 'lodash-es'
import { ComponentType } from 'react'

export function setStyle(dom: HTMLElement, style: CSSStyleDeclaration) {
  const styleKeys = Object.keys(style)
  const cachedStyle = pick(dom.style, styleKeys)
  Object.assign(dom.style, style)
  return () => {
    Object.assign(dom.style, cachedStyle)
  }
}

export function addCss(dom: HTMLElement, cls: string) {
  dom.classList.add(cls)
  return () => {
    dom.classList.remove(cls)
  }
}

export interface ReactFiber {
  type?: string | ComponentType
  key?: string
  return?: ReactFiber
  child?: ReactFiber
  sibling?: ReactFiber
  stateNode: HTMLElement | any | null
  _debugSource?: {
    __mometa: MometaData
  }
}

export function parseReactDomNodeDeep(dom: HTMLElement) {
  while (dom) {
    const data = parseReactDomNode(dom)
    if (!data) {
      dom = dom.parentElement
      continue
    }

    if (!!data.mometa) {
      return data
    }

    if (data.fiber) {
      let fiber = data.fiber
      while (fiber && !fiber?._debugSource?.__mometa) {
        fiber = fiber.return
      }
      if (fiber) {
        return {
          mometa: fiber._debugSource?.__mometa,
          fiber
        }
      }
    }
    dom = dom.parentElement
  }
}

const domMap = new WeakMap()
export function parseReactDomNode(dom: HTMLElement) {
  const cachedName = domMap.get(dom)
  if (cachedName) {
    const { fiberName, propName } = cachedName
    if (propName && dom[propName]?.__mometa) {
      return {
        fiber: !!fiberName && dom[fiberName],
        mometa: dom[propName]?.__mometa
      }
    }
    if (fiberName && dom[fiberName]?._debugSource?.__mometa) {
      return {
        fiber: dom[cachedName?.fiberName] as ReactFiber,
        mometa: dom[cachedName?.fiberName]?._debugSource?.__mometa
      }
    }
  }

  const fiberName = Object.keys(dom).find((name) => /^__reactFiber\$.+$/.test(name))
  if (fiberName && dom[fiberName]?._debugSource?.__mometa) {
    domMap.set(dom, { fiberName })
    return {
      fiber: dom[fiberName] as ReactFiber,
      mometa: dom[fiberName]?._debugSource?.__mometa
    }
  }

  const propName = Object.keys(dom).find((name) => /^__reactProps\$.+$/.test(name))
  if (propName && dom[propName]?.__mometa) {
    domMap.set(dom, { propName, fiberName })
    return {
      fiber: !!fiberName && (dom[fiberName] as ReactFiber),
      mometa: dom[propName]?.__mometa
    }
  }

  if (fiberName) {
    return {
      fiber: dom[fiberName] as ReactFiber
    }
  }
}

export function getDomName(dom: HTMLElement) {
  let name = dom.localName
  if (dom.getAttribute('id')) {
    name += `#${dom.getAttribute('id')}`
    return name
  }
  if (dom.getAttribute('class')?.trim()) {
    name += `.${Array.from(dom.classList.entries()).join('.')}`
  }
  return name
}
