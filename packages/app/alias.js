const hook = require('require-resolve-hook').default

if (process.env.WEBPACK_VERSION) {
  const regexp = /^(webpack$|webpack\/.+$)/
  hook(regexp, (id, p) => {
    return require.resolve(`webpack${process.env.WEBPACK_VERSION}${id.slice('webpack'.length)}`)
  })
}
