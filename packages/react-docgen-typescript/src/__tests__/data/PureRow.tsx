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
 * Row description
 */
export class Row extends React.PureComponent<IRowProps, {}> {
  public render() {
    return <div>Test</div>
  }
}
