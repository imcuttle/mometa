import * as React from 'react'
import withHOC, { HOCInjectedProps } from './withHOC'

export interface HOCProps {
  /** myProp description */
  myProp: string
}

/** HOCIntersectionProps description */
export const HOCIntersectionProps: React.SFC<HOCProps & HOCInjectedProps> = (props) => <div />

export default withHOC({})(HOCIntersectionProps)
