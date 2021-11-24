import { BabelFile, PluginObj, PluginPass, TransformOptions } from '@babel/core'
import { ImportNode, ModuleNode } from '../type'

interface MetaPluginCtx {
  modulePath: ModulePath
}

interface MetaBabelFile extends BabelFile {
  metadata: MetaPluginCtx
}

interface MetaPluginPass extends PluginPass {
  file: MetaBabelFile
}

declare module '@babel/core' {
  interface BabelFile {
    // @ts-ignore
    metadata: MetaPluginCtx
  }

  interface BabelFileMetadata extends MetaPluginCtx {}
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
      ImportDeclaration(path, p) {
        path.get('source').node.extra
        // console.log(path.get('source').getSource())
      }
    }
  } as PluginObj<MetaPluginPass>
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
