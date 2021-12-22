import * as React from 'react'

interface StatelessProps {
  foo?: string
}

const Stateless: React.SFC<StatelessProps> = (props) => <div />

export default Stateless
