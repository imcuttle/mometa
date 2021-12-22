import * as React from 'react'

export interface StatefulProps {
  /** myProp description */
  myProp: string
}

/** Statefull description */
export class Stateful extends React.Component<StatefulProps> {
  static displayName = 'StatefulDisplayName'

  render() {
    return <div>My Property = {this.props.myProp}</div>
  }
}
