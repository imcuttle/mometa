const __MOMETA_LOCAL__ = !!process.env.__MOMETA_LOCAL__
if (__MOMETA_LOCAL__) {
  module.exports = require('../src/babel/react')
} else {
  module.exports = require('../lib/babel/react')
}
