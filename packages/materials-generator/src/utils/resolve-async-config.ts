import { Material } from '../types'
import * as nps from 'path'

const isObject = (value) => typeof value === 'object' && value !== null

// Customized for this use-case
const isObjectCustom = (value) =>
  isObject(value) && !(value instanceof RegExp) && !(value instanceof Error) && !(value instanceof Date)

export const mapObjectSkip = Symbol('mapObjectSkip')

const _mapObject = (object, mapper, options, isSeen = new WeakMap()) => {
  options = {
    deep: false,
    target: {},
    ...options
  }

  if (isSeen.has(object)) {
    return isSeen.get(object)
  }

  isSeen.set(object, options.target)

  const { target } = options
  delete options.target

  const mapArray = (array) =>
    array.map((element) => (isObjectCustom(element) ? _mapObject(element, mapper, options, isSeen) : element))
  if (Array.isArray(object)) {
    return mapArray(object)
  }

  for (const [key, value] of Object.entries(object)) {
    const mapResult = mapper(key, value, object, target)

    if (mapResult === mapObjectSkip) {
      continue
    }

    let [newKey, newValue, { shouldRecurse = true } = {}] = mapResult

    // Drop `__proto__` keys.
    if (newKey === '__proto__') {
      continue
    }

    if (options.deep && shouldRecurse && isObjectCustom(newValue)) {
      newValue = Array.isArray(newValue) ? mapArray(newValue) : _mapObject(newValue, mapper, options, isSeen)
    }

    target[newKey] = newValue
  }

  return target
}

function mapObject(object, mapper, options) {
  if (!isObject(object)) {
    throw new TypeError(`Expected an object, got \`${object}\` (${typeof object})`)
  }

  return _mapObject(object, mapper, options)
}

export async function resolveAsyncConfig<T = any>(config: T): Promise<T> {
  config = await Promise.resolve(config)

  const tasks = []
  const newConfig = mapObject(
    config,
    (key, val, raw, target) => {
      if ((val && val instanceof Promise) || typeof val.then === 'function') {
        tasks.push(
          Promise.resolve(val).then((resolved) => {
            target[key] = resolved
          })
        )
        return [key, val, { shouldRecurse: false }]
      }
      return [key, val]
    },
    {
      deep: true
    }
  )

  await Promise.all(tasks)

  return newConfig
}

const myRequire = (p) => {
  const mod = require(p)
  if (mod.__esModule) {
    return mod.default ?? mod
  }
  return mod
}

const exists = (p) => {
  try {
    return !!require.resolve(p)
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      return false
    }
    throw e
  }
}

export async function resolveLibMatConfig<T extends Material | Material[] = Material>(path: string): Promise<T> {
  let config: T
  if (nps.isAbsolute(path) || path.startsWith('.')) {
    config = myRequire(nps.resolve(path))
  } else if (path.startsWith('@')) {
    config = myRequire(path)
  } else if (exists(`@mometa-mat/${path}`)) {
    config = myRequire(`@mometa-mat/${path}`)
  } else {
    config = myRequire(path)
  }
  return resolveAsyncConfig(config)
}
