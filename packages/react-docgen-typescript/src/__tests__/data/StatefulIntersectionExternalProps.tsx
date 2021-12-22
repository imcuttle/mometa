import * as React from 'react'
import { ExternalOptionalComponentProps } from './ExternalPropsComponentProps'

export interface StatefulProps {
  /** myProp description */
  myProp: string
}

/** StatefulIntersectionExternalProps description */
export class StatefulIntersectionExternalProps extends React.Component<StatefulProps & ExternalOptionalComponentProps> {
  render() {
    return <div />
  }
}
