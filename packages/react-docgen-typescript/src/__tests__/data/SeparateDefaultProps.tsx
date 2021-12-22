import * as React from 'react'

const defaultProps = {
  id: 123,
  disabled: false
}

interface SeparateDefaultPropsProps {
  id: number
  disabled: boolean
}

/** SeparateDefaultProps description */
export const SeparateDefaultProps = (props: SeparateDefaultPropsProps) => <div>test</div>

SeparateDefaultProps.defaultProps = defaultProps
