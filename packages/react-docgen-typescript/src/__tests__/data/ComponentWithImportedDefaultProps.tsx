import * as React from 'react'
import { defaultProps } from './const'

interface ComponentWithImportedDefaultPropsProps {
  name: string
}

export class ComponentWithImportedDefaultProps extends React.Component<ComponentWithImportedDefaultPropsProps> {
  static defaultProps = defaultProps

  constructor(props: ComponentWithImportedDefaultPropsProps) {
    super(props)
  }

  render() {
    const { name } = this.props
    return <div>{name}</div>
  }
}
