import * as React from 'react'

export enum enumSample {
  HELLO = 'hi',
  BYE = 'bye'
}

/** StatelessWithDefaultProps props */
export interface StatelessWithDefaultPropsProps {
  /**
   * sample with default value
   * @default hello
   */
  sampleDefaultFromJSDoc: 'hello' | 'goodbye'
  /** sampleTrue description */
  sampleTrue?: boolean
  /** sampleFalse description */
  sampleFalse?: boolean
  /** sampleEnum description */
  sampleEnum?: enumSample
  /** sampleString description */
  sampleString?: string
  /** sampleObject description */
  sampleObject?: { [key: string]: any }
  /** sampleNull description */
  sampleNull?: null
  /** sampleUndefined description */
  sampleUndefined?: any
  /** sampleNumber description */
  sampleNumber?: number
}

/** StatelessWithDefaultProps description */
export const StatelessWithDefaultProps: React.StatelessComponent<StatelessWithDefaultPropsProps> = (props) => (
  <div>test</div>
)

StatelessWithDefaultProps.defaultProps = {
  sampleEnum: enumSample.HELLO,
  sampleFalse: false,
  sampleNull: null,
  sampleNumber: -1,
  // prettier-ignore
  sampleObject: { a: '1', b: 2, c: true, d: false, e: undefined, f: null, g: { a: '1' } },
  sampleString: 'hello',
  sampleTrue: true,
  sampleUndefined: undefined
}
