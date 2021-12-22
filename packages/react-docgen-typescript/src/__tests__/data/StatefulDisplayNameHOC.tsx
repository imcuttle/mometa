/* tslint:disable:max-classes-per-file */

import * as React from 'react'

export interface StatefulProps {
  /** myProp description */
  myProp: string
}

function hoc() {
  return (Component: React.ComponentType<any>) => {
    class HOC extends React.Component<{}> {
      render() {
        return <Component {...this.props} />
      }
    }
    return HOC
  }
}

/** Statefull description */
export class Stateful extends React.Component<StatefulProps> {
  static displayName = 'StatefulDisplayName'

  render() {
    return <div>My Property = {this.props.myProp}</div>
  }
}

export default hoc()(Stateful)
