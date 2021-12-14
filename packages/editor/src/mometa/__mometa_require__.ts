globalThis.__mometa_require__ = function (path) {
  // @ts-ignore
  const res =
    window.parent?.__externals_modules?.[path] ??
    {
      react: require('react'),
      'react-dom': require('react-dom')
    }[path]

  return res
}
