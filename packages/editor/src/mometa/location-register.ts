import { getSharedFromMain } from './utils/get-from-main'
const { locationActionSubject } = getSharedFromMain()

const getUrl = (url) => {
  if (url == null) {
    return null
  }

  if (url.trim().startsWith('#')) {
    return location.pathname + (location.search || '') + url
  }
  return url
}

// React Router <=5 HashRouter
window.addEventListener('hashchange', (evt) => {
  locationActionSubject.next({ action: 'PUSH', url: getUrl(location.hash) })
})

// BrowserRouter & React Router >=6 HashRouter
const rawPushState = history.pushState
history.pushState = function _pushState() {
  const [, , url] = arguments
  if (url != null) {
    Promise.resolve().then(() => {
      locationActionSubject.next({ action: 'PUSH', url: getUrl(url) })
    })
  }
  return rawPushState.apply(this, arguments)
}

const rawReplaceState = history.replaceState
history.replaceState = function _replaceState() {
  const [, , url] = arguments
  if (url != null) {
    Promise.resolve().then(() => {
      locationActionSubject.next({ action: 'REPLACE', url: getUrl(url) })
    })
  }
  return rawReplaceState.apply(this, arguments)
}
