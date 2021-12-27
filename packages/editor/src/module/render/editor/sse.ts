import { EventEmitter } from 'events'

export function createClientConnection(url) {
  if (typeof EventSource === 'undefined') {
    throw new Error(`Because of typeof EventSource === 'undefined', So materials hot updating feature is disabled`)
  } else {
    const source = new EventSource(url)
    const evtEmitter = new EventEmitter()
    source.addEventListener('message', function (ev) {
      let data: any = {}
      try {
        data = JSON.parse(ev.data)
        console.log('data', data)
        evtEmitter.emit('message', data)
      } catch (e) {}
    })

    return {
      addHandler: (handler: (d: any) => void) => {
        evtEmitter.on('message', handler)
        return () => {
          evtEmitter.off('message', handler)
        }
      },
      close: () => {
        source.close()
        evtEmitter.removeAllListeners()
      }
    }
  }
}
