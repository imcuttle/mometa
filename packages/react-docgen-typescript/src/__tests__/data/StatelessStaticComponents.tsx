import * as React from 'react'

interface LabelProps {
  /** title description */
  title: string
}

/** StatelessStaticComponents.Label description */
const SubComponent = (props: LabelProps) => <div>My Property = {props.title}</div>

interface StatelessStaticComponentsProps {
  /** myProp description */
  myProp: string
}

/** StatelessStaticComponents description */
export const StatelessStaticComponents = (props: StatelessStaticComponentsProps) => (
  <div>My Property = {props.myProp}</div>
)

StatelessStaticComponents.Label = SubComponent
