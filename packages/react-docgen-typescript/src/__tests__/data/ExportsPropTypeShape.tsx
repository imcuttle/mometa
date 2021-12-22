import * as PropTypes from 'prop-types'
import * as React from 'react'

export const SomeShape = PropTypes.shape({})

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
