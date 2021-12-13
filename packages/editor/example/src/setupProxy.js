const proxy = require('http-proxy-middleware')

module.exports = function (app) {
  if (process.env.MOMETA_MODE === 'client') {
    const csbProxy = proxy.createProxyMiddleware({
      logLevel: 'debug',
      ws: true,
      // @see https://github.com/cuttle-fighting/codesandbox-client/tree/for-mometa
      target: 'http://localhost:4001',
      changeOrigin: true,
      pathRewrite: {}
    })
    app.use('/bundler.html', csbProxy)
    app.use('/static/', csbProxy)
    app.use('/babel-transpiler.*.worker.js', csbProxy)
  }
}
