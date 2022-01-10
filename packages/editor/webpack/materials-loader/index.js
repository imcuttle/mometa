const loaderUtils = require('loader-utils')

module.exports.pitch = async function (request) {
  const chunks = request.split('!')
  const originRequest = chunks[chunks.length - 1]
  const config = require(originRequest)

  return `
  var config = null;

  console.log('config', config)

  module.exports = config
`
}
