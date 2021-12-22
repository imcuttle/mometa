import * as React from 'react'

export interface OnlyDefaultExportUnionProps {
  /** The content */
  content: string
}

/** OnlyDefaultExportUnion description */
const OnlyDefaultExportUnion: React.FC<OnlyDefaultExportUnionProps> & {
  handledProps: Array<keyof OnlyDefaultExportUnionProps>
} = (props) => <div />

OnlyDefaultExportUnion.handledProps = ['content']

export default OnlyDefaultExportUnion
