const __MOMETA_LOCAL__ = !!process.env.__MOMETA_LOCAL__
if (__MOMETA_LOCAL__) {
  module.exports = require('../src/mometa/preset/react/babel/inject')
} else {
  module.exports = require('../lib/mometa/preset/react/babel/inject')
}
