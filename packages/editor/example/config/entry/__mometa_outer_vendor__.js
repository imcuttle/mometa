global.__mometa_outer_vendor_require__ = (path) => {
  if (typeof __mometa_outer_vendor__ === 'undefined' || !__mometa_outer_vendor__?.[path]) {
    return {
      react: require('react'),
      'react-dom': require('react-dom')
    }[path]
  }
  return __mometa_outer_vendor__?.[path]
}
