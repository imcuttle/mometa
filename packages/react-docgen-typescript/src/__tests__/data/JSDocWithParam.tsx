import * as React from 'react'

/** JSDocWithParamProps props */
export interface JSDocWithParamProps {
  /** prop1 description */
  prop1: string
}

/**
 * JSDocWithParamProps description
 *
 * NOTE: If a parent element of this control is `overflow: hidden` then the
 * balloon may not show up.
 *
 * @param props Control properties (defined in `SimpleDropdownProps` interface)
 */
export const JSDocWithParam = (props: JSDocWithParamProps) => {
  return <div>Test</div>
}
