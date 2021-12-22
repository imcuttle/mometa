import * as React from 'react'

interface LabelProps {
  /** title description */
  title: string
}

/** Column.Label description */
const SubComponent = (props: LabelProps) => <div>My Property = {props.title}</div>

/**
 * Column properties.
 */
export interface IColumnProps {
  /** prop1 description */
  prop1: string
}

/**
 * Column description
 */
export class Column extends React.Component<IColumnProps, {}> {
  public static Label = SubComponent

  /** Column.SubLabel description */
  public static SubLabel() {
    return <div>sub</div>
  }

  public render() {
    const { prop1 } = this.props
    return <div>{prop1}</div>
  }
}

export default Column
