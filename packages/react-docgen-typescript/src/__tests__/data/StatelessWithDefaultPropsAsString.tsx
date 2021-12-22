import * as React from 'react'

/** StatelessWithDefaultProps props */
export interface StatelessWithDefaultPropsAsStringProps {
  /** sampleTrue description */
  sampleTrue?: boolean
  /** sampleFalse description */
  sampleFalse?: boolean
  /** sampleNumberWithPrefix description */
  sampleNumberWithPrefix?: number
  /** sampleNumber description */
  sampleNumber?: number
  /** sampleNull description */
  sampleNull?: null
  /** sampleUndefined description */
  sampleUndefined?: undefined
}

export const StatelessWithDefaultPropsAsString: React.StatelessComponent<StatelessWithDefaultPropsAsStringProps> = (
  props
) => <div>test</div>

StatelessWithDefaultPropsAsString.defaultProps = {
  sampleFalse: false,
  sampleNull: null,
  sampleNumber: 1,
  sampleNumberWithPrefix: -1,
  sampleTrue: true,
  sampleUndefined: undefined
}
