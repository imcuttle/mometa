import { isInIframe } from '../shared/utils'

if (!global.__MOMETA_INITIALIZED__) {
  global.__MOMETA_INITIALIZED__ = true

  if (__mometa_env_react_jsx_runtime__ && __mometa_env_is_dev__) {
    const JSXDEVRuntime = require('$mometa-external:react/jsx-dev-runtime')
    const { jsxDEV } = JSXDEVRuntime
    // 转移 __mometa
    JSXDEVRuntime.jsxDEV = function _jsxDev() {
      let [type, props, key, isStaticChildren, source, ...rest] = arguments
      if (props?.__mometa) {
        const __mometa = props?.__mometa
        delete props?.__mometa
        if (isInIframe()) {
          source = {
            ...source,
            __mometa
          }
        }
      }
      return jsxDEV.apply(this, [type, props, key, isStaticChildren, source, ...rest])
    }
  }

  // iframe
  if (isInIframe()) {
    require('./shared-register')
    require('./location-register')
    require('./render-register')
  }
}
