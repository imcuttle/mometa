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

export function parseReactDomNode(dom: HTMLElement) {
  const propName = Object.keys(dom).find((name) => /^__reactProps\$.+$/.test(name))
  if (!propName) {
    return
  }
  const props = dom[propName]
  // eslint-disable-next-line consistent-return
  return {
    props
  }
}
