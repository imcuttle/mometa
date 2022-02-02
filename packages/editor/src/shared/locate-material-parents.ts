export const locateMaterialParents = function locateMaterialParents(materialsConfig, path) {
  var parents = []
  var target = materialsConfig[path[0]]
  if (!target) {
    return
  }
  parents.push(target)
  const isInvalid = path.slice(1).some(function (k, i) {
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
    if (!target) {
      return true
    }
    parents.push(target)
  })

  if (isInvalid) {
    return
  }

  return parents
}
