import * as React from 'react'

export interface StatelessProps {
  /** myProp description */
  myProp: string
}

/** Stateless description */
const Stateless: React.SFC<StatelessProps> = (props) => <div>My Property = {props.myProp}</div>

Stateless.displayName = 'StatelessDisplayNameDefaultExport'

export default Stateless
