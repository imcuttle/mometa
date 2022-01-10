/**
 * @file createEventStream
 * @author imcuttle <moyuyc95@gmail.com>
 * @date 2018/10/28
 *
 */

// https://github.com/webpack-contrib/webpack-hot-middleware/blob/master/middleware.js

function createEventStream(heartbeat) {
  var clientId = 0
  var clients = {}
  function everyClient(fn) {
    Object.keys(clients).forEach(function (id) {
      fn(clients[id])
    })
  }
  var interval = setInterval(function heartbeatTick() {
    everyClient(function (client) {
      client.write('data: \uD83D\uDC93\n\n')
    })
  }, heartbeat)

  if (interval && interval.unref) {
    interval.unref()
  }

  return {
    close: function () {
      clearInterval(interval)
      everyClient(function (client) {
        if (!client.finished) client.end()
      })
      clients = {}
    },
    size() {
      return Object.keys(clients).length
    },
    handler: function (req, res, { onClose } = {}) {
      var headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/event-stream;charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        // While behind nginx, event stream should not be buffered:
        // http://nginx.org/docs/http/ngx_http_proxy_module.html#proxy_buffering
        'X-Accel-Buffering': 'no'
      }

      var isHttp1 = !(parseInt(req.httpVersion) >= 2)
      if (isHttp1) {
        req.socket.setKeepAlive(true)
        Object.assign(headers, {
          Connection: 'keep-alive'
        })
      }
      res.writeHead(200, headers)
      res.write('\n')
      var id = clientId++
      clients[id] = res
      req.on('close', function () {
        if (!res.finished) res.end()
        delete clients[id]
        if (onClose) {
          onClose(req, res)
        }
      })

      return {
        publish: (payload) => {
          clients[id].write('data: ' + JSON.stringify(payload) + '\n\n')
        }
      }
    },
    publish: function (payload) {
      everyClient(function (client) {
        client.write('data: ' + JSON.stringify(payload) + '\n\n')
      })
    }
  }
}

module.exports = createEventStream
