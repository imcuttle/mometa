import * as React from 'react'

export interface StyledComponentClassProps {
  /** myProp description */
  myProp: string
}

/** Stateless description */
const StyledComponentClass: React.SFC<StyledComponentClassProps> = (props) => <div>My Property = {props.myProp}</div>

// If we had a styled component, it would emit StyledComponentClass
// by default.
export default StyledComponentClass
