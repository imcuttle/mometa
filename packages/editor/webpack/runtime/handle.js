var locateMaterialParents = require('./locate-material-parents')

function get(target, name) {
  if (!target) {
    return
  }
  if (Array.isArray(name)) {
    if (!name.length) {
      return target
    }
    return get(target[name[0]], name.slice(1))
  }
  return target[name]
}

module.exports = function (clientRenderEntities, materialsConfigName) {
  var materialsConfig = get(global, materialsConfigName)

  if (clientRenderEntities && clientRenderEntities.length) {
    clientRenderEntities.some(function (entity) {
      var parents = locateMaterialParents(materialsConfig, entity.path)
      if (!parents || !parents.length) {
        console.error(`clientRenderEntities and materialsConfig is not matched`, {
          materialsConfig,
          clientRenderEntities
        })
        return true
      }

      var target = parents[parents.length - 1]
      target.runtime = Object.assign({}, entity.runtime, target.runtime)
    })
  }
  return materialsConfig
}
