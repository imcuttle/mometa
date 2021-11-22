export interface Node<T extends string = string, D = any> {
  type: T
  data?: D
}

export interface ImportNode extends Node<'import'> {
  // mode: 'default' | ;named;
}
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
