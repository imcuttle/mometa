const { createSearchHelper, material } = require('../../../src')

const h = createSearchHelper(module)

module.exports = material('a', 'a', h.groups(['./src/groups-a', './src/groups-b']))
