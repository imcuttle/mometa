interface StackBaseProps<T> {
  as: T
  hasWrap?: boolean
}

interface StackJustifyProps {
  /** The foo prop should not repeat the description */
  foo?: 'blue'
  /** You cannot use gap when using a "space" justify property */
  gap?: never
}

interface StackGapProps {
  /** The foo prop should not repeat the description */
  foo?: 'red'
  /** The space between children */
  gap?: number
}

type StackProps<T> = StackBaseProps<T> & (StackGapProps | StackJustifyProps)

/** SimpleGenericUnionIntersection description */
export const SimpleGenericUnionIntersection = <T extends any>(props: StackProps<T>) => <div />
