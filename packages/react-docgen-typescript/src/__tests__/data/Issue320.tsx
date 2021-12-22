import * as React from 'react'

/**
 * that example is copied from MaterialUI
 * some components return not expected interface/type
 * like Avatar, IconButton, etc.
 */

export interface OverridableTypeMap {
  props: {}
}

interface Props {
  text: string
}

export interface OverridableComponent<M extends OverridableTypeMap> {
  (props: M['props'] & { color?: string }): JSX.Element
  (props: M): JSX.Element
}

export type ComponentTypeMap = {
  props: {
    text: string
  }
}

const Component: OverridableComponent<ComponentTypeMap> =
  () =>
  ({ text }: Props) => {
    return <div>{text}</div>
  }

export default Component
