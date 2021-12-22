import * as React from 'react'

/**
 * A repro props interface
 */
export interface IReproProps {
  /** foo description */
  foo: any
}

/**
 * MyComponent description
 */
export class MyComponent extends React.Component<IReproProps, {}> {
  public render() {
    const repeat = (func) => setInterval(func, 16)

    return <div>test</div>
  }
}
