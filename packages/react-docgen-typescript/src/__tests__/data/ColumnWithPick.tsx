import * as React from 'react'

/**
 * Column properties.
 */
export interface ManyProps {
  /** prop1 description */
  prop1?: string
  /** prop2 description */
  prop2: number
  /**
   * prop3 description
   */
  prop3: () => void
  /** prop4 description */
  prop4: 'option1' | 'option2' | 'option3'
}

export interface ColumnProps extends Pick<ManyProps, 'prop1' | 'prop2'> {
  /** propx description */
  propx: number
}

/**
 * Column description
 */
export class Column extends React.Component<ColumnProps, {}> {
  public render() {
    const { prop1 } = this.props
    return <div>{prop1}</div>
  }
}
