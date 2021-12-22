import * as React from 'react'

/** IComponentWithDefaultPropsProps props */
export interface IComponentWithDefaultPropsProps {
  /**
   * sample with default value
   * @default hello
   */
  sampleDefaultFromJSDoc: 'hello' | 'goodbye'
  /** sampleTrue description */
  sampleTrue?: boolean
  /** sampleFalse description */
  sampleFalse?: boolean
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

/** ComponentWithDefaultProps description */
export class ComponentWithDefaultProps extends React.Component<IComponentWithDefaultPropsProps, {}> {
  static defaultProps: Partial<IComponentWithDefaultPropsProps> = {
    sampleFalse: false,
    sampleNull: null,
    sampleNumber: -1,
    // prettier-ignore
    sampleObject: { a: '1', b: 2, c: true, d: false, e: undefined, f: null, g: { a: '1' } },
    sampleString: 'hello',
    sampleTrue: true,
    sampleUndefined: undefined
  }

  public render() {
    return <div>test</div>
  }
}
