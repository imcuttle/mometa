import { isInIframe } from '../shared/utils'

if (!global.__MOMETA_INITIALIZED__) {
  global.__MOMETA_INITIALIZED__ = true

  // iframe
  if (isInIframe()) {
    require('./shared-register')
    require('./location-register')
    require('./render-register')
  }
}
