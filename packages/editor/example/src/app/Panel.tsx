import React from 'react'

export class Panel extends React.Component<any, any> {
  render() {
    return (
      // @ts-ignore
      <panel {...this.props}>
        <h2>Panel Title</h2>
        <div>Panel Content</div>
        {/*// @ts-ignore*/}
      </panel>
    )
  }
}
