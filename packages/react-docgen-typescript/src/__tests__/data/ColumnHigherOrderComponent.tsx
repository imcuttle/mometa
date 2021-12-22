import * as React from 'react'
import { externalHoc } from './ColumnHigherOrderComponentHoc'
/**
 * Column properties.
 */
export interface IColumnProps {
  /** prop1 description */
  prop1: string
}

/**
 * Form column.
 */
class Column extends React.Component<IColumnProps, {}> {
  public static defaultProps: Partial<IColumnProps> = {
    prop1: 'prop1'
  }

  public render() {
    const { prop1 } = this.props
    return <div>{prop1}</div>
  }
}

/**
 * Row properties.
 */
export interface IRowProps {
  /** prop1 description */
  prop1: string
}

/**
 * Form row.
 */
const Row = (props: IRowProps) => {
  const innerFunc = (rowProps: IRowProps) => {
    return <span>Inner Func</span>
  }
  const innerNonExportedFunc = (rowProps: IRowProps) => {
    return <span>Inner Func</span>
  }
  return <div>Test</div>
}

function hoc<T>(C: T): T {
  return ((props) => <div>{C}</div>) as any as T
}

/** ColumnHigherOrderComponent1 description */
export const ColumnHigherOrderComponent1 = hoc(Column)

/** ColumnHigherOrderComponent2 description */
export const ColumnHigherOrderComponent2 = hoc(Column)

/** RowHigherOrderComponent1 description */
export const RowHigherOrderComponent1 = hoc(Row)

/** RowHigherOrderComponent2 description */
export const RowHigherOrderComponent2 = hoc(Row)

/** ColumnExternalHigherOrderComponent description */
export const ColumnExternalHigherOrderComponent = externalHoc(Column)

/** RowExternalHigherOrderComponent description */
export const RowExternalHigherOrderComponent = externalHoc(Row)
