// register externals for iframe
const modules = (global.__externals_modules = {
  'react-dom': require('react-dom'),
  react: require('react'),
  'react-dnd': require('react-dnd')
})

export function addModule(path, exports: any) {
  const prev = modules[path]
  const has = Reflect.has(modules, path)
  modules[path] = exports

  return () => {
    if (has) {
      modules[path] = prev
    } else {
      delete modules[path]
    }
  }
}

export function addModules(mods: Record<string, any>) {
  const fns = []
  for (const [name, exp] of Object.entries(mods)) {
    fns.push(addModule(name, exp))
  }
  return () => {
    fns.forEach((fn) => fn())
  }
}
