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

interface RangeLocation {
  start: {
    line: number
    column: number
  }
  end: {
    line: number
    column: number
  }
}

interface MometaData extends RangeLocation {
  name: string
  text: string
  filename: string
  emptyChildren: boolean
  relativeFilename: string
  hash: string

  isFirst: boolean
  selfClosed: boolean
  innerStart: {
    line: number
    column: number
  }
  innerEnd: {
    line: number
    column: number
  }

  container?: {
    isFirstElement: boolean
    text: string
    hash: string
  } & RangeLocation

  previousSibling?: {
    text: string
  } & RangeLocation

  nextSibling?: {
    text: string
  } & RangeLocation
}
