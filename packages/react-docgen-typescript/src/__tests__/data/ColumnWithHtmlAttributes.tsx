import * as React from 'react'

/**
 * Column properties.
 */
export interface IColumnProps extends React.HTMLAttributes<any> {
  /** prop1 description */
  prop1?: string
  /** prop2 description */
  prop2: number
}

/**
 * Column description
 */
export class Column extends React.Component<IColumnProps, {}> {
  public static defaultProps: Partial<IColumnProps> = {
    prop1: 'prop1'
  }

  public render() {
    const { prop1 } = this.props
    return <div>{prop1}</div>
  }
}
