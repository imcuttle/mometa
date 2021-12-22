import * as React from 'react'

/** IComponentWithTypeJsDocTag props */
export interface IComponentWithTypeJsDocTag {
  /**
   * sample with custom type
   * @type string
   */
  sampleTypeFromJSDoc: number
}

/** ComponentWithTypeJsDocTag description */
export class ComponentWithTypeJsDocTag extends React.Component<IComponentWithTypeJsDocTag, {}> {
  public render() {
    return <div>test</div>
  }
}
