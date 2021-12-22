import * as React from 'react'

/**
 * A repro props interface
 */
export interface IReproProps {
  /** A foo property */
  foo: any
}

/**
 * My Repro Component
 */
export class Repro extends React.Component<IReproProps, {}> {
  constructor(props) {
    super(props)
  }

  repro() {
    let repro
    repro = 1
  }

  render() {
    return <div />
  }
}
