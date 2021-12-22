import * as React from 'react'

export interface HOCInjectedProps {
  /** injected description */
  injected: boolean
}

type HOCWrapper = <P = {}>(Component: React.ComponentType<P & HOCInjectedProps>) => React.ComponentType<P>

export default function withHOC(options: object = {}): HOCWrapper {
  return function withHocWrapper<P>(Component: React.ComponentType<P & HOCInjectedProps>): React.ComponentType<P> {
    return class HOC extends React.Component<P> {
      render() {
        return <Component {...this.props} />
      }
    }
  }
}
