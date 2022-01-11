import { detectDepFileSync } from 'detect-dep'

const loaderUtils = require('loader-utils')
// const { detectDepFileSync } = require('detect-dep')

/**
 *
 * @this {import('webpack').LoaderContext}
 * @returns {Promise<string>}
 */
module.exports.pitch = async function (request) {
  // this.cacheable(false)
  // const chunks = request.split('!')
  // const resource = chunks[chunks.length - 1]
  // const deps = detectDepFileSync(resource, {
  //   moduleImport: false,
  //   recursive: true
  // }).concat(resource)
  // const config = require(resource)
  // console.log('deps', deps)
  // deps.forEach((dep) => this.addDependency(dep))
  //   return `
  //   import config from ${loaderUtils.stringifyRequest(this, request)};
  //
  //   console.log('config', config)
  //
  //   module.exports = config
  // `
}
