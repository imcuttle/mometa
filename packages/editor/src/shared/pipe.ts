export const data = new Map()
let pipeId
export let remoteGlobalThisSet = new Set()

const SYMBOL_NAME = `__MOMETA_PIPE__`

export function setId(id) {
  pipeId = id
}
export function getId() {
  return pipeId
}

export function addRemoteGlobalThis(g: any) {
  remoteGlobalThisSet.add(g)
}

export function removeRemoteGlobalThis(g: any) {
  remoteGlobalThisSet.delete(g)
}

export function register(name, value) {
  data.set(name, value)
  return () => {
    data.delete(name)
  }
}

export function getInLocal(name) {
  return data.get(name)
}

export function hasInLocal(name) {
  return data.has(name)
}

export function getByRemoteOnce(name) {
  for (const g of remoteGlobalThisSet.values()) {
    if (g[SYMBOL_NAME] && g[SYMBOL_NAME].hasInLocal(name)) {
      return g[SYMBOL_NAME].getInLocal(name)
    }
  }
}

export function getByRemoteById(name, id) {
  for (const g of remoteGlobalThisSet.values()) {
    if (g[SYMBOL_NAME] && g[SYMBOL_NAME].getId() === id) {
      return g[SYMBOL_NAME].getInLocal(name)
    }
  }
}

const exps = {
  getId,
  getByRemoteById,
  getInLocal,
  getByRemoteOnce,
  setId,
  addRemoteGlobalThis,
  register,
  hasInLocal,
  remoteGlobalThisSet,
  removeRemoteGlobalThis,
  data
}

// console.log('globalThis[SYMBOL_NAME]', document.currentScript)
globalThis[SYMBOL_NAME] = exps
