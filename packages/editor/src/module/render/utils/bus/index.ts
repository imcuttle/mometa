import { get } from 'lodash-es'

const enum FrameType {
  INITIALIZED = 0,
  INITIALIZED_ACK,
  INPUT,
  RETURN
}

interface FrameData {
  seq?: number
  ack?: number
  channel: string
  side: any
  type: FrameType
  preload?: any
}

const stringify = (data: FrameData) => {
  return JSON.stringify({
    __meta_bus__: true,
    ...data
  })
}

const parse = (data: string) => {
  let dataJson: FrameData & { __meta_bus__: boolean }
  if (typeof data !== 'string') {
    dataJson = data
  } else {
    try {
      dataJson = JSON.parse(data)
    } catch (e) {
      return
    }
  }
  if (!dataJson.__meta_bus__) {
    return
  }
  return dataJson
}

const createDefer = () => {
  let resolve
  let reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return {
    promise,
    resolve,
    reject
  }
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
function timeout<T>(promise: Promise<T>, ms: number) {
  if (!ms || ms <= 0) {
    return promise
  }
  return Promise.race([
    delay(ms).then(() => {
      const error: any = new Error('timeout')
      error.code = 'TIMEOUT'
      throw error
    }),
    promise
  ])
}

function createBusFactory({ side }: { side: any }) {
  return function createBusInner(
    boss: Pick<Worker | WindowProxy, 'postMessage' | 'addEventListener' | 'removeEventListener'>,
    methods: Record<any, any>,
    channel: string,
    {
      timeoutMs = 5000
    }: {
      timeoutMs?: number
    } = {}
  ) {
    const isValidData = (data: any) => {
      if (!data || data.side === side) return
      if (data.channel !== channel) return
      return true
    }

    const stringifyFrameData = (data: Omit<FrameData, 'side' | 'channel'>) => {
      return stringify({ ...data, side, channel })
    }

    let pendingQueue: Array<{ defer: ReturnType<typeof createDefer>; preload: any }> = []
    let remoteInitialized = false
    const initialize = () => {
      if (remoteInitialized) {
        return
      }
      remoteInitialized = true
      pendingQueue.forEach((task) => {
        rpc(task.preload.method, ...task.preload.args).then((res) => {
          task.defer.resolve(res)
        }, task.defer.reject)
      })
      pendingQueue = []
    }

    async function globalMessageHandle(evt: MessageEvent) {
      const data = parse(evt.data)
      if (!isValidData(data)) return
      if (data.type === FrameType.INITIALIZED) {
        initialize()
        boss.postMessage(
          stringifyFrameData({
            type: FrameType.INITIALIZED_ACK
          })
        )
        return
      } else if (data.type === FrameType.INITIALIZED_ACK) {
        initialize()
        return
      }

      if (data.type !== FrameType.INPUT) return

      const { method, args } = data.preload
      const fn = get(methods, method)
      let result
      let error
      try {
        if (typeof fn === 'function') {
          result = await fn(...args)
        } else {
          throw new Error(`method: ${method} is not a function, but ${typeof fn}`)
        }
      } catch (err) {
        error = {
          message: err.message,
          stack: err.stack,
          code: err.code
        }
      }
      boss.postMessage(
        stringifyFrameData({
          ack: data.seq,
          type: FrameType.RETURN,
          preload: {
            result,
            error
          }
        })
      )
    }

    boss.addEventListener('message', globalMessageHandle)
    boss.postMessage(
      stringifyFrameData({
        type: FrameType.INITIALIZED
      })
    )

    let seq = 1
    async function rpc(method: string, ...args: any[]) {
      if (!remoteInitialized) {
        console.warn('remoteInitialized = false, waiting...', { method, args, side })
        const defer = createDefer()
        const task = { defer, preload: { method, args } }
        pendingQueue.push(task)
        return timeout(defer.promise, timeoutMs)
      }

      return new Promise((resolve, reject) => {
        const id = seq++
        function messageHandle(evt: MessageEvent) {
          const data = parse(evt.data)
          if (!isValidData(data)) return
          if (data.type !== FrameType.RETURN) return
          if (data.ack !== id) return

          const { error, result } = data.preload
          if (!error) {
            resolve(result)
          } else {
            const err: any = new Error(error.message)
            err.code = error.code
            reject(err)
          }

          boss.removeEventListener('message', messageHandle)
        }
        boss.addEventListener('message', messageHandle)
        boss.postMessage(
          stringifyFrameData({
            type: FrameType.INPUT,
            seq: id,
            preload: {
              method,
              args
            }
          })
        )
      })
    }

    return {
      rpc,
      methods,
      dispose: () => {
        boss.removeEventListener('message', globalMessageHandle)
      }
    }
  }
}

export const createBus = createBusFactory({ side: 'a' })
export const createBusB = createBusFactory({ side: 'b' })
