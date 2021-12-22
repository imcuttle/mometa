import { Component, ParserOptions, PropFilter, PropItem, StaticPropFilter } from './parser'

export function buildFilter(opts: ParserOptions): PropFilter {
  return (prop: PropItem, component: Component) => {
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
      const { skipPropsWithName, skipPropsWithoutDoc } = propFilter as StaticPropFilter
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
