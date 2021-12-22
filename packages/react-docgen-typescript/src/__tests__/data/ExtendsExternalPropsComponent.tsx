import * as React from 'react'
import { ParentProps } from './ExtendsExternalPropsComponentParentProps'

interface ExtendsExternalPropsComponentProps extends ParentProps {
  /** prop2 */
  prop2?: string
}

/**
 * ExtendsExternalPropsComponent description
 */
export class ExtendsExternalPropsComponent extends React.Component<ExtendsExternalPropsComponentProps, {}> {
  public render() {
    return <div>ExtendsExternalPropsComponent</div>
  }
}
