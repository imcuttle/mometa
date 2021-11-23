import { BabelFile, PluginObj, PluginPass, TransformOptions } from '@babel/core'
import { ImportNode, ModuleNode } from '../type'
import * as t from '@babel/types'
import { Hub, NodePath, Scope } from '@babel/traverse'

declare module '@babel/core' {
  interface BabelFile {
    // @ts-ignore
    metadata: {
      modulePath: ModulePath
    }
  }

  interface BabelFileMetadata {
    modulePath: ModulePath
  }
}

class ModulePath {
  imports: ModuleNode['imports'] = []
  exports: ModuleNode['exports'] = []

  addImport(importNode: ImportNode) {
    this.imports.push(importNode)
  }
}

const plgName = (name) => `meta:${name}`

const createParseImportsPlugin = () => {
  return {
    name: plgName('parse-imports'),
    visitor: {
      // Imp
    }
  } as PluginObj
}

export const createMetaPlugins = (customPlugins = []) => {
  return {
    plugins: [
      {
        name: plgName('initialize'),
        pre(file) {
          file.metadata = file.metadata || {}
          Object.assign(file.metadata, {
            modulePath: new ModulePath()
          })
        }
      } as PluginObj,
      createParseImportsPlugin(),
      ...customPlugins
    ]
  }
}
