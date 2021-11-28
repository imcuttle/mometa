const nps = require('path')
const { paramCase, pascalCase } = require('change-case')

const packagePrefix = require('../../package.json').packagePrefix || ''

module.exports = (edam) => {
  return {
    prompts: [
      {
        name: 'name',
        type: 'input',
        message: `输入组件名`,
        default: '',
        transformer: (value) => paramCase(value),
        validate: (name) => !name && '必填'
      }
    ],
    process: ({ name, description, useTs }) => {
      edam.config.output = nps.join(edam.config.output, name)
      return {
        move: {
          '**/*.hbs': '[path][name]'
        }
      }
    }
  }
}
