import * as React from 'react'

export interface StatelessShorthandDefaultPropsProps {
  /** regularProp description */
  regularProp: string
  /** shorthandProp description */
  shorthandProp?: number
  /** onCallback description */
  onCallback?: () => void
}

/** StatelessShorthandDefaultProps description */
export const StatelessShorthandDefaultProps: React.SFC<StatelessShorthandDefaultPropsProps> = (props) => <div />

const shorthandProp = 123

StatelessShorthandDefaultProps.defaultProps = {
  regularProp: 'foo',
  shorthandProp,
  onCallback() {
    return null
  }
}
