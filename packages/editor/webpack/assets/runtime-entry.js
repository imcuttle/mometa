if (__mometa_env_is_runtime_build__ || __mometa_env_is_local__) {
  module.exports = require(`../../src/mometa/entry`)
} else {
  module.exports = require(`../../build/runtime-entry`)
}
