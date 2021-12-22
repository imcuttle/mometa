'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.buildFilter = void 0
function buildFilter(opts) {
  return (prop, component) => {
    const { propFilter } = opts
    // skip children property in case it has no custom documentation
    if (prop.name === 'children' && prop.description.length === 0 && opts.skipChildrenPropWithoutDoc !== false) {
      return false
    }
    if (typeof propFilter === 'function') {
      const keep = propFilter(prop, component)
      if (!keep) {
        return false
      }
    } else if (typeof propFilter === 'object') {
      const { skipPropsWithName, skipPropsWithoutDoc } = propFilter
      if (typeof skipPropsWithName === 'string' && skipPropsWithName === prop.name) {
        return false
      } else if (Array.isArray(skipPropsWithName) && skipPropsWithName.indexOf(prop.name) > -1) {
        return false
      }
      if (skipPropsWithoutDoc && prop.description.length === 0) {
        return false
      }
    }
    return true
  }
}
exports.buildFilter = buildFilter
//# sourceMappingURL=buildFilter.js.map
