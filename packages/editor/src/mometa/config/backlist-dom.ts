import { lazy } from '../../shared/utils'

export const lazyDomGetter = lazy(() => {
  const doc = document.createElement('mometa-runtime')
  document.body.appendChild(doc)
  return doc
})

export const globalGetContainer = lazy(() => {
  const div = document.createElement('div')
  Object.assign(div.style, {
    position: 'fixed',
    left: 0,
    top: 0
  })
  document.body.appendChild(div)
  return div
})

export function getBlackListDom() {
  return [lazyDomGetter(), globalGetContainer()]
}
