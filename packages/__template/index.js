const nps = require('path')
const { paramCase } = require('change-case')

const packagePrefix = require('../../package.json').packagePrefix || ''

module.exports = (edam) => {
  return {
    prompts: [
      {
        name: 'name',
        type: 'input',
        message: `输入包名，不需要加入 \`${packagePrefix}\` 前缀 `,
        default: '',
        transformer: (value) => paramCase(value),
        validate: (name) => !name && '包名必填'
      },
      {
        name: 'description',
        type: 'input',
        message: '一句话描述该包',
        default: '',
        validate: (name) => !name && '描述必填'
      },
      {
        name: 'useTs',
        type: 'confirm',
        message: '使用 Typescript 吗？',
        default: true
      }
    ],
    process: ({ name, description, useTs }) => {
      const output = (edam.config.output = nps.join(edam.config.output, name))
      const rootPath = nps.join(__dirname, '../../')
      const scriptsPath = nps.join(rootPath, 'scripts')

      const move = {
        'package.json.js': '[name]',
        '**/*.hbs': '[path][name]'
      }

      if (!useTs) {
        Object.assign(move, {
          '**/*.ts': '[path][name].js',
          '**/*.tsx': '[path][name].js'
        })
      }

      return {
        move,
        ignore: [!useTs && 'tsconfig.json.hbs'].filter(Boolean),
        variables: {
          packagePrefix,
          scriptBin: nps.relative(output, scriptsPath),
          rootRelativeDir: nps.relative(output, rootPath)
        }
      }
    }
  }
}
