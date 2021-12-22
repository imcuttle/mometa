import * as React from 'react'

export interface StatelessProps {
  /** myProp description */
  myProp: string
}

export interface StatelessMoreProps {
  /** moreProp description */
  moreProp: number
}

/** StatelessIntersectionProps description */
export const StatelessIntersectionProps: React.SFC<StatelessProps & StatelessMoreProps> = (props) => <div />
