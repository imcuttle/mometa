globalThis.__mometa_require__ = function (path) {
  const res =
    // @ts-ignore
    window.parent?.__externals_modules?.[path] ??
    {
      react: require('react'),
      'react-dom': require('react-dom'),
      '@mometa/react-refresh-webpack-plugin/lib/runtime/RefreshUtils': require('@mometa/react-refresh-webpack-plugin/lib/runtime/RefreshUtils')
    }[path]

  return res
}
