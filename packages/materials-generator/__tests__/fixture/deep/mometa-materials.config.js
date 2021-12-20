const { createSearchHelper } = require('../../../src')

const h = createSearchHelper(module)

module.exports = {
  key: 'a',
  name: 'a',
  assetGroups: h.groups(['./src/groups-a', './src/groups-b'])
}
