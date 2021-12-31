declare var __mometa_env_react_jsx_runtime__: any
declare var __mometa_env_is_dev__: any
declare var __mometa_env_which__: 'react'

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
