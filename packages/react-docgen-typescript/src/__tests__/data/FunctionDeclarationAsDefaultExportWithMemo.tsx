import * as React from 'react'

/** JumbotronProps props */
interface JumbotronProps {
  /** prop1 description */
  prop1: string
}

/**
 * Jumbotron description
 */
function Jumbotron(props: JumbotronProps) {
  return <div>Test</div>
}

export default React.memo(Jumbotron)
