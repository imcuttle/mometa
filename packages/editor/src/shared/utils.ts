export function isInIframe() {
  return window.parent && window.parent !== window
}

export function lazy<T extends () => any>(fn: T): T {
  let isCalled = false
  let v

  // @ts-ignore
  return () => {
    if (!isCalled) {
      isCalled = true
      v = fn()
    }
    return v
  }
}
