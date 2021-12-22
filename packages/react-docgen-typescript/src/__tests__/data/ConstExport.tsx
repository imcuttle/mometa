import * as React from 'react'

/**
 * Row properties.
 */
export interface IRowProps {
  /** prop1 description */
  prop1?: string
  /** prop2 description */
  prop2: number
}

/**
 * test description
 */
export const test = (one: number) => {
  return one
}

export const myObj = {
  foo: 'bar'
}

/**
 * Row description
 */
export const Row = (props: IRowProps) => {
  const innerFunc = (rowProps: IRowProps) => {
    return <span>Inner Func</span>
  }
  const innerNonExportedFunc = (rowProps: IRowProps) => {
    return <span>Inner Func</span>
  }
  return <div>Test</div>
}

const nonExportedFunc = (props: IRowProps) => {
  return <div>No Export</div>
}
