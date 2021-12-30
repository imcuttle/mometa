module.exports = {
  ...require('../../package.json').jest,
  moduleNameMapper: {
    ...require('../../package.json').jest.moduleNameMapper
  }
}
