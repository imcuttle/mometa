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
      var target = materialsConfig[entity.path[0]]
      if (!target) {
        return
      }
      const isInvalid = entity.path.slice(1).some(function (k, i) {
        let name
        if (i === 0) {
          name = 'assetGroups'
        } else if (i === 1) {
          name = 'assets'
        }
        if (!target[name]) {
          return true
        }
        target = target[name][k]
      })

      if (isInvalid) {
        console.error(`clientRenderEntities and materialsConfig is not matched`, {
          materialsConfig,
          clientRenderEntities
        })
        return true
      }

      target.runtime = Object.assign({}, entity.runtime, target.runtime)
    })
  }
  return materialsConfig
}
