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
