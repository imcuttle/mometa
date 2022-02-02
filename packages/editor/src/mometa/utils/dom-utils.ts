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
  actualStartTime: number
  return?: ReactFiber
  child?: ReactFiber
  alternate?: ReactFiber
  sibling?: ReactFiber
  pendingProps?: Record<any, any>
  memoizedProps?: Record<any, any>
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
      while (fiber && !getMometaDataFromFiber(fiber)) {
        fiber = fiber.return
      }
      if (fiber) {
        return {
          mometa: getMometaDataFromFiber(fiber),
          fiber
        }
      }
    }
    dom = dom.parentElement
  }
}

export function getLatestFiber(f?: ReactFiber) {
  if (!f) {
    return f
  }
  if (f.alternate) {
    return f.alternate.actualStartTime > f.actualStartTime ? f.alternate : f
  }
  return f
}

export function getMometaDataFromFiber(f: ReactFiber): MometaData | undefined {
  if (!f) {
    return
  }
  return f._debugSource?.__mometa ?? f.memoizedProps?.__mometa ?? f.pendingProps?.__mometa
}

const domMap = new WeakMap()
export function parseReactDomNode(dom: HTMLElement) {
  const cachedName = domMap.get(dom)
  if (cachedName) {
    const { fiberName, propName } = cachedName
    if (propName && dom[propName]?.__mometa) {
      return {
        fiber: !!fiberName && getLatestFiber(dom[fiberName]),
        mometa: dom[propName]?.__mometa
      }
    }
    if (fiberName && getMometaDataFromFiber(getLatestFiber(dom[fiberName]))) {
      return {
        fiber: getLatestFiber(dom[cachedName?.fiberName]) as ReactFiber,
        mometa: getMometaDataFromFiber(getLatestFiber(dom[cachedName?.fiberName]))
      }
    }
  }

  const fiberName = Object.keys(dom).find(
    (name) => /^__reactFiber\$.+$/.test(name) || /^__reactInternalInstance\$.+$/.test(name)
  )
  if (fiberName && getMometaDataFromFiber(dom[fiberName])) {
    domMap.set(dom, { fiberName })
    const fiberNode = getLatestFiber(dom[fiberName])
    return {
      fiber: fiberNode as ReactFiber,
      mometa: getMometaDataFromFiber(fiberNode)
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
