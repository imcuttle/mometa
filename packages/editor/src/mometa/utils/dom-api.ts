import { pick } from 'lodash-es'

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

const domMap = new WeakMap()
export function parseReactDomNode(dom: HTMLElement) {
  const cachedName = domMap.get(dom)
  if (cachedName) {
    if (dom[cachedName]) {
      return {
        props: dom[cachedName]
      }
    }
  }
  const propName = Object.keys(dom).find((name) => /^__reactProps\$.+$/.test(name))
  if (!propName) {
    return
  }

  domMap.set(dom, propName)
  const props = dom[propName]
  // eslint-disable-next-line consistent-return
  return {
    props
  }
}
