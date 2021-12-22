import * as React from 'react'

export interface ForwardRefDefaultExportProps {
  /** myProp description */
  myProp: string
}

/** ForwardRefDefaultExport description */
const ForwardRefDefaultExport = React.forwardRef(
  (props: ForwardRefDefaultExportProps, ref: React.Ref<HTMLDivElement>) => (
    <div ref={ref}>My Property = {props.myProp}</div>
  )
)

export default ForwardRefDefaultExport
