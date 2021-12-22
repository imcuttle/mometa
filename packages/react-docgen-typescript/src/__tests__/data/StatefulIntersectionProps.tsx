import * as React from 'react'

export interface StatefulProps {
  /** myProp description */
  myProp: string
}

export interface StatefulMoreProps {
  /** moreProp description */
  moreProp: number
}

/** StatefulIntersectionProps description */
export class StatefulIntersectionProps extends React.Component<StatefulProps & StatefulMoreProps> {
  render() {
    return <div />
  }
}
