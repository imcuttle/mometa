if (__mometa_env_is_runtime_build__ || __mometa_env_is_local__) {
  require('../../src/mometa/__mometa_require__')
  module.exports = require(`../../src/mometa/preset/${__mometa_env_which__}/entry`)
} else {
  module.exports = require(`../../build/runtime-entry`)
}
