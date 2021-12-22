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

/**
 * Column description
 */
export class Column extends React.Component<IColumnProps, {}> {
  public static defaultProps: Partial<IColumnProps> = {
    prop1: 'prop1'
  }

  /**
   * My super cool method
   * @param myParam Documentation for parameter 1
   * @public
   * @returns The answer to the universe
   */
  myCoolMethod(myParam: number, mySecondParam?: string): number {
    return 42
  }

  /**
   * @public
   */
  myBasicMethod() {
    return null
  }

  /**
   * @public
   */
  myArrowFunction = () => 23

  myPrivateFunction() {
    return 99
  }

  public render() {
    const { prop1 } = this.props
    return <div>{prop1}</div>
  }
}

export default Column
