import * as React from 'react'

export interface StatelessProps {
  /** myProp description */
  myProp: string
}

/** Stateless description */
export const Stateless: React.StatelessComponent<StatelessProps> = (props) => <div>My Property = {props.myProp}</div>

Stateless.displayName = 'StatelessDisplayName'
