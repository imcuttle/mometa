module.exports = goodbye

const handlers = []

let exitCode = 0
let forceExit = false
let exiting = false

const onsigint = onsignal.bind(null, 'SIGINT')
const onsigterm = onsignal.bind(null, 'SIGTERM')

function onsignal(name) {
  forceExit = forceExit || process.listenerCount(name) === 1
  process.removeListener('SIGINT', onsigint)
  process.removeListener('SIGTERM', onsigterm)
  exitCode = 130
  onexit()
}

function onexit() {
  if (exiting) return
  exiting = true

  process.removeListener('beforeExit', onexit)
  Promise.allSettled(handlers.map((fn) => fn())).then(done, done)

  function done() {
    if (forceExit) process.exit(exitCode)
  }
}

function setup() {
  process.prependListener('beforeExit', onexit)
  process.prependListener('SIGINT', onsigint)
  process.prependListener('SIGTERM', onsigterm)
}

function cleanup() {
  process.removeListener('beforeExit', onexit)
  process.removeListener('SIGINT', onsigint)
  process.removeListener('SIGTERM', onsigterm)
}

function goodbye(fn) {
  if (handlers.length === 0) setup()
  handlers.push(fn)

  return function unregister() {
    const i = handlers.indexOf(fn)
    if (i > -1) handlers.splice(i, 1)
    if (!handlers.length) cleanup()
  }
}
