const refreshWebpackPluginOptions = require('@mometa/react-refresh-webpack-plugin/lib/options.json')

module.exports = {
  additionalProperties: false,
  type: 'object',
  definitions: {
    ...refreshWebpackPluginOptions.definitions,
    ReactOptions: {
      anyOf: [{ type: 'boolean' }, { $ref: '#/definitions/ReactOptionsFull' }]
    },
    ReactOptionsFull: {
      additionalProperties: false,
      type: 'object',
      properties: {
        refreshWebpackPlugin: refreshWebpackPluginOptions,
        refresh: {
          type: 'boolean'
        }
      }
    },
    ServerOptions: {
      additionalProperties: false,
      type: 'object',
      properties: {
        host: {
          type: 'string'
        },
        port: {
          type: 'number'
        },
        baseURL: {
          type: 'string'
        }
      }
    },
    EditorConfig: {
      additionalProperties: true,
      type: 'object',
      properties: {
        bundlerURL: {
          type: 'string'
        },
        apiBaseURL: {
          type: 'string'
        }
      }
    }
  },
  properties: {
    contentBasePath: {
      type: 'string'
    },
    __webpack: {},
    serverOptions: { $ref: '#/definitions/ServerOptions' },
    editorConfig: { $ref: '#/definitions/EditorConfig' },
    react: { $ref: '#/definitions/ReactOptions' }
  }
}
