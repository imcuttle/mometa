import { get, has, unset } from 'lodash-es'

function loadJs(src: string, name?: string | string[]) {
  const script = document.createElement('script')
  script.src = src
  document.head.appendChild(script)

  const url = new URL(src, location.href)

  return Object.assign(
    new Promise((resolve, reject) => {
      function windowErrorHandler(err) {
        if (err.filename === url.href) {
          reject(err.error)
        }
      }
      script.onload = () => {
        window.removeEventListener('error', windowErrorHandler)
        resolve(name ? get(window, name) : undefined)
      }
      script.onerror = (err) => {
        window.removeEventListener('error', windowErrorHandler)
        reject(err)
      }
      window.addEventListener('error', windowErrorHandler)
    }),
    {
      remove: () => {
        script.remove()
      }
    }
  )
}

export async function fetchPreload(preload: { files: string[]; name: string | string[] }) {
  const tasks = []
  const _loadJs = (src) => {
    const p = loadJs(src)
    tasks.push(p)
    return p
  }

  const serialPromise = preload.files.reduce((p, file) => {
    return p.then(() => _loadJs(file))
  }, Promise.resolve())

  await serialPromise

  const exported = get(window, preload.name)
  if (has(window, preload.name)) {
    unset(window, preload.name)
  }
  return {
    exported,
    dispose: () => {
      tasks.forEach((t) => t.remove())
    }
  }
}
