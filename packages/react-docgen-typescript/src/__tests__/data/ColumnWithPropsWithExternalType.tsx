import * as React from 'react'
import MyExternalType from './ColumnWithPropsWithExternalType.MyExternalType'

/**
 * ColumnWithPropsWithExternalType properties.
 */
export interface IColumnWithPropsWithExternalTypeProps {
  /** prop1 description */
  prop1?: string
  /** prop2 description */
  prop2: number
  /**
   * prop3 description
   */
  prop3: MyExternalType
}

/**
 * ColumnWithPropsWithExternalType description
 */
export class ColumnWithPropsWithExternalType extends React.Component<IColumnWithPropsWithExternalTypeProps, {}> {
  public render() {
    const { prop1 } = this.props
    return <div>{prop1}</div>
  }
}

export default ColumnWithPropsWithExternalType
