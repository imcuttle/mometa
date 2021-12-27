import React from 'react'

export class Panel extends React.Component<any, any> {
  render() {
    return (
      // @ts-ignore
      <panel {...this.props}>
        <div>Panel Content</div>
        <h2>Panel Title</h2>
        {/*// @ts-ignore*/}
      </panel>
    )
  }
}
