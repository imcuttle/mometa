if (!global.__MOMETA_INITIALIZED__) {
  global.__MOMETA_INITIALIZED__ = true

  require('./__mometa_require__')
  if (window.parent !== window && require('@@__mometa-external/shared')) {
    require('./location-register')

    // @ts-ignore
    module.exports = require(`../../src/mometa/preset/${__mometa_env_which__}/entry`)
  }
}
