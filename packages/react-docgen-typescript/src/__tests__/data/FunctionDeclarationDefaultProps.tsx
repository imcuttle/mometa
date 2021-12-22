import * as React from 'react'

interface FunctionDeclarationDefaultPropsProps {
  id?: number
}

/** FunctionDeclarationDefaultProps description */
export const FunctionDeclarationDefaultProps = (props: FunctionDeclarationDefaultPropsProps) => {
  return <div>Hello World</div>
}

FunctionDeclarationDefaultProps.defaultProps = {
  id: 1
}
