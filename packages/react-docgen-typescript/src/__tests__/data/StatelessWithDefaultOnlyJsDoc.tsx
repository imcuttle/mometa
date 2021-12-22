import * as React from 'react'

export interface StatelessWithDefaultOnlyJsDocProps {
  /** @default hello */
  myProp: string
}
/** StatelessWithDefaultOnlyJsDoc description */
export const StatelessWithDefaultOnlyJsDoc: React.StatelessComponent<StatelessWithDefaultOnlyJsDocProps> = (props) => (
  <div>My Property = {props.myProp}</div>
)
