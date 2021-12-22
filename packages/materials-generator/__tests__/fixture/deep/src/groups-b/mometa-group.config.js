const { createSearchHelper, group } = require('../../../../../src')

const h = createSearchHelper(module)

module.exports = group('group-b', 'group-b', h.assets([]))
