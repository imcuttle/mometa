import * as React from 'react'

export type StatelessProps<T extends React.JSXElementConstructor<any>> = React.ComponentProps<T> & {
  /** myProp description */
  myProp: string
}

/** StatelessIntersectionGenericProps description */
export const StatelessIntersectionGenericProps = <T extends React.JSXElementConstructor<any>>(
  props: StatelessProps<T>
) => <div />
