import * as React from 'react'

export interface ForwardRefDefaultValuesProps {
  /** myProp description */
  myProp: string
}

/** ForwardRefDefaultValues description */
export const ForwardRefDefaultValues = React.forwardRef(
  ({ myProp = "I'm default" }: ForwardRefDefaultValuesProps, ref: React.Ref<HTMLDivElement>) => (
    <div ref={ref}>My Property = {props.myProp}</div>
  )
)
