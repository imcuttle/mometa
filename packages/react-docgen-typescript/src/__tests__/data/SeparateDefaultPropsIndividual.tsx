import * as React from 'react'

const defaultProps2 = {
  id: 123
}

const defaultProps = {
  id: defaultProps2.id,
  disabled: false
}

interface SeparateDefaultPropsIndividualProps {
  id: number
  disabled: boolean
}

/** SeparateDefaultPropsIndividual description */
export const SeparateDefaultPropsIndividual = (props: SeparateDefaultPropsIndividualProps) => <div>test</div>

SeparateDefaultPropsIndividual.defaultProps = {
  id: defaultProps.id,
  disabled: defaultProps.disabled
}
