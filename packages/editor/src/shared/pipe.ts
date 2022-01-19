let pipeId
let data = new Map()
let remoteGlobalThisSet = new Set()

const SYMBOL_NAME = `__MOMETA_PIPE__`

function setId(id) {
  pipeId = id
}
function getId() {
  return pipeId
}

function addRemoteGlobalThis(g: any) {
  remoteGlobalThisSet.add(g)
}

function removeRemoteGlobalThis(g: any) {
  remoteGlobalThisSet.delete(g)
}

function register(name, value) {
  data.set(name, value)
  return () => {
    data.delete(name)
  }
}

function getInLocal(name) {
  return data.get(name)
}

function hasInLocal(name) {
  return data.has(name)
}

function getByRemoteOnce(name) {
  for (const g of remoteGlobalThisSet.values()) {
    if (g[SYMBOL_NAME] && g[SYMBOL_NAME].hasInLocal(name)) {
      return g[SYMBOL_NAME].getInLocal(name)
    }
  }
}

function getByRemoteById(name, id) {
  for (const g of remoteGlobalThisSet.values()) {
    if (g[SYMBOL_NAME] && g[SYMBOL_NAME].getId() === id) {
      return g[SYMBOL_NAME].getInLocal(name)
    }
  }
}

const exps = (module.exports = globalThis[SYMBOL_NAME] || {
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
})

// console.log('globalThis[SYMBOL_NAME]', document.currentScript)
globalThis[SYMBOL_NAME] = exps

module.exports = exps as any
