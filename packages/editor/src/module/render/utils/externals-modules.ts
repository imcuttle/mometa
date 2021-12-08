// register externals for iframe
const modules = (global.__externals_modules = {
  'react-dom': require('react-dom'),
  react: require('react')
})

export function addModule(path, exports: any) {
  const prev = modules[path]
  modules[path] = exports
  return () => {
    modules[path] = prev
  }
}
