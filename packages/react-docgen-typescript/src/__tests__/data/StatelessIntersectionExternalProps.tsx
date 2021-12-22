import * as React from 'react'
import { ExternalOptionalComponentProps } from './ExternalPropsComponentProps'

export interface StatelessProps {
  /** myProp description */
  myProp: string
}

/** StatelessIntersectionExternalProps description */
export const StatelessIntersectionExternalProps: React.SFC<StatelessProps & ExternalOptionalComponentProps> = (
  props
) => <div />
