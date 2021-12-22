import * as React from 'react'

export interface StatelessProps {
  /** myProp description */
  myProp: string
}

function hoc() {
  return (Component: React.ComponentType<any>) => {
    class HOC extends React.Component<{}> {
      render() {
        return <Component {...this.props} />
      }
    }
    return HOC
  }
}

/** Stateless description */
export const Stateless: React.StatelessComponent<StatelessProps> = (props) => <div>My Property = {props.myProp}</div>

Stateless.displayName = 'StatelessDisplayName'

export default hoc()(Stateless)
