declare module '@@__mometa-external/react-dnd' {
  export * from 'react-dnd'
}

declare module '@@__mometa-external/react' {
  export * from 'react'
  export { default as default } from 'react'
}

declare module '@@__mometa-external/react-dom' {
  export * from 'react-dom'
  export { default as default } from 'react-dom'
}

declare module '@@__mometa-external/shared' {
  let exp: any
  export = exp

  export const useHeaderStatus: any
  export const useOveringNode: any
  export const useSelectedNode: any
  export const api: any
}

declare var __mometa_require__ = (path: string) => typeof import(path)

interface MometaData {
  start: {
    line: number
    column: number
  }
  end: {
    line: number
    column: number
  }
  name: string
  text: string
  filename: string
  emptyChildren: boolean
  hash: string
  container?: {
    start: {
      line: number
      column: number
    }
    end: {
      line: number
      column: number
    }
    isFirstElement: boolean
    text: string
    hash: string
  }
}
