// @loader module?indent=2

module.exports = ({ packagePrefix, name, description, scriptBin, _, useTs }) => {
  const scripts = {
    test: `${scriptBin}/run test`,
    build: `${scriptBin}/run build`,
    packlimit: `${scriptBin}/run packlimit`,
    dev: `npm run build -- --watch`,
    prepublishOnly: `npm run build && npm run packlimit`,
    version: `npm test && npm run packlimit`
  }

  const pkg = {
    name: `${packagePrefix}${name}`,
    version: '0.0.0',
    publishConfig: {
      access: 'public'
    },
    author: `${_.git.name} <${_.git.email}>`,
    description,
    main: 'lib',
    types: 'types',
    module: 'es',
    files: useTs ? ['lib', 'es', 'types'] : ['src'],
    scripts,
    dependencies: {},
    keywords: [_.git.name].concat(name.split('.')).concat(require('../../../package.json').keywords || []),
    repository: {
      type: 'git',
      url: 'git+' + _.git.remote,
      directory: 'packages/' + name
    }
  }

  if (!useTs) {
    delete scripts.build
    delete scripts.prepublishOnly

    pkg.main = 'src'
    delete pkg.types
    delete pkg.module
  }

  return pkg
}
