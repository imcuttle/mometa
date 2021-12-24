const http = require('http')
const fs = require('fs')
const nps = require('path')
const { createFsHandler, commonMiddlewares } = require('@mometa/fs-handler')

const launchEditor = require('./launchEditor')

const joinUrl = (a, b) => (a + b).replace(/\/+/g, '/')
const stripPrefix = (prefix, path) => {
  if (path.startsWith(prefix)) {
    return joinUrl('/', path.slice(prefix.length))
  }
  return joinUrl('/', path)
}

const concatStringPromise = (req) => {
  return new Promise((res, rej) => {
    let data = []
    req.on('data', (chunk) => {
      data.push(chunk)
    })
    req.on('end', () => {
      res(Buffer.concat(data).toString('utf-8'))
    })
    req.on('error', rej)
  })
}

const json = async (req) => {
  const string = await concatStringPromise(req)
  return JSON.parse(string)
}

exports.createServer = function createServer({
  host = 'localhost',
  port = '8686',
  apiBaseURL = '',
  fileSystem = fs,
  context = '',
  react
}) {
  const fsHandler = createFsHandler({
    fs: fileSystem,
    middlewares: commonMiddlewares()
  })

  const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('content-type', 'application/json; charset=utf8')

    if (req.method.toUpperCase() === 'OPTIONS') {
      res.statusCode = 200
      res.end()
      return
    }

    try {
      if (req.method.toUpperCase() === 'POST') {
        switch (stripPrefix(apiBaseURL, req.url)) {
          case '/submit-op': {
            const body = await json(req)
            if (!body.preload.filename) {
              throw new Error('Requires preload.filename')
            }
            body.preload.filename = nps.relative(context, body.preload.filename)
            await fsHandler(body)
            res.statusCode = 200
            res.write('true')
            return
          }

          case '/open-editor': {
            const body = await json(req)
            launchEditor(body.fileName, body.lineNumber, body.colNumber)
            res.statusCode = 200
            res.write('true')
            return
          }
        }
      }

      res.statusCode = 404
    } catch (err) {
      console.error('[MMS]', err)
      res.statusCode = 501
      res.write(JSON.stringify({ error: String(err) }))
    } finally {
      res.end()
    }
  })

  return new Promise((res) => {
    server.listen(port, host, () => {
      console.log(`[MMS] run on http://${host}:${port}${apiBaseURL}`)
      res(server)
    })
  })
}
