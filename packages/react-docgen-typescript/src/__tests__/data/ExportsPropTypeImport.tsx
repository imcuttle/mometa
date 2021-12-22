import * as React from 'react'
import { SomeShape } from './shapes'

export { SomeShape }

/**
 * A repro props interface
 */
export interface ExportsPropTypesProps {
  /** foo description */
  foo: any
}

/**
 * ExportsPropTypes description
 */
export class ExportsPropTypes extends React.Component<ExportsPropTypesProps, {}> {
  render() {
    return <div />
  }
}
