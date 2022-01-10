const loaderUtils = require('loader-utils')
const { resolveLibMatConfig } = require('@mometa/materials-resolver')

module.exports.pitch = async function (request) {
  this.cacheable(false)
  console.log('request', request)
  const reqs = request.split('!')
  const config = await resolveLibMatConfig(reqs[reqs.length - 1])

  return `
  var config = ${JSON.stringify(config)};

  if (module.hot) {
    module.hot.addStatusHandler(status => {
      console.log('status', status);
    });
  }
  console.log('module.hot', module.hot);
  console.log('config', config)

  module.exports = async () => {
    console.log('config', config)
    return config
  }
`
}
