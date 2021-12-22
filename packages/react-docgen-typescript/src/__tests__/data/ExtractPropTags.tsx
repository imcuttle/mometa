import * as React from 'react'

interface Todo {
  title: string
  description: string
  completed: boolean
}

/** ExtractPropTags props */
export interface ExtractPropTagsProps {
  /**
   * prop1 description
   * @ignore ignoreMe
   * @kind category 2
   * @custom123 something
   */
  prop1?: Pick<Todo, 'title' | 'completed'>
  /** prop2 description
   * @internal some internal prop
   * @kind category 1
   */
  prop2: string
}

const ExtractPropTags = (props: ExtractPropTagsProps) => {
  return <div>Test</div>
}

export { ExtractPropTags }
