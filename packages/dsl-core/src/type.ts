export interface Node<T extends string = string, D = any> {
  type: T
  data?: D
}

// import * as _hintedName from "source"
export interface NamespaceImportNode extends Node<'import', { nameHint?: string }> {
  mode: 'namespace'
  source: string
}
// import "source"
export interface SideEffectImportNode extends Node<'import'> {
  mode: 'sideEffect'
  source: string
}
// import { named as _hintedName } from "source"
export interface NamedImportNode extends Node<'import', { nameHint?: string }> {
  mode: 'named'
  source: string
}
// import _hintedName from "source"
export interface DefaultImportNode extends Node<'import', { nameHint?: string }> {
  mode: 'default'
  source: string
}

export type ImportNode = NamespaceImportNode | DefaultImportNode | SideEffectImportNode | NamedImportNode

export interface ExportNode extends Node<'export'> {
  mode: 'default' | 'named'
}

export interface RawCodeNode extends Node<'raw'> {
  code: string
}

export interface HttpFetchNode extends Node<'http-fetch'> {
  url: string
  method: string
  query?: any
  body?: any
  headers?: Record<string, any>
}

export type FetchNode = HttpFetchNode

export interface UiRenderNode extends Node<'ui-render'> {
  children: Array<RawCodeNode | UiRenderNode>
}

export type BodyNode = RawCodeNode | FetchNode | UiRenderNode

export interface ModuleNode extends Node<'module'> {
  id: string | null
  imports: ImportNode[]
  body: Array<BodyNode>
  exports: ExportNode[]
}
