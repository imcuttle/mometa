import * as React from 'react'

/**
 * Column properties.
 */
export interface IColumnProps {
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

// tslint:disable-next-line: no-console
console.log('test')

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

export default Column
