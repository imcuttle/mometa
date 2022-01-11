function loadJs(src: string, name?: string) {
  const script = document.createElement('script')
  script.src = src
  script.crossOrigin = 'annoymonus'
  document.head.appendChild(script)
  return Object.assign(
    new Promise((resolve, reject) => {
      script.onload = () => {
        resolve(name ? window[name] : undefined)
      }
      script.onerror = reject
    }),
    {
      remove: () => {
        script.remove()
      }
    }
  )
}

export async function fetchPreload(preload: { files: string[]; name: string }) {
  const tasks = preload.files.map((x) => loadJs(x))
  await Promise.all(tasks)
  return {
    exported: window[preload.name],
    dispose: () => {
      tasks.forEach((t) => t.remove())
    }
  }
}
