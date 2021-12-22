import * as React from 'react'

/** IAppMenuProps props */
export interface IAppMenuProps {
  /** menu description */
  menu: any
}

export interface IAppMenuState {
  menu: any
}

/** AppMenu description */
export class AppMenu extends React.Component<IAppMenuProps, IAppMenuState> {
  constructor(props, context) {
    super(props, context)
    this.state = {
      menu: this.props.menu
    }

    this.handleClick = this.handleClick.bind(this)
  }

  componentWillReceiveProps(newProps: IAppMenuProps) {
    /* empty on purpose */
  }

  handleClick(info) {
    /* empty on purpose */
  }

  render() {
    return <div onClick={this.handleClick}>test</div>
  }
}
