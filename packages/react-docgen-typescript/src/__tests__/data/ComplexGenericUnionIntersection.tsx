declare type PropsOf<E extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>> =
  JSX.LibraryManagedAttributes<E, React.ComponentPropsWithoutRef<E>>

/** Props for a Box component that supports the "innerRef" and "as" props. */
type BoxProps<E extends React.ElementType, P = any> = P &
  PropsOf<E> & {
    /** Render the component as another component */
    as?: E
  }

interface StackBaseProps {
  /** The flex "align" property */
  align?: 'stretch' | 'center' | 'flex-start' | 'flex-end'
}

interface StackJustifyProps {
  /**
   * Use flex 'space-between' | 'space-around' | 'space-evenly' and
   * flex will space the children.
   */
  justify?: 'space-between' | 'space-around' | 'space-evenly'
  /** You cannot use gap when using a "space" justify property */
  gap?: never
}

interface StackGapProps {
  /**
   * Use flex 'center' | 'flex-start' | 'flex-end' | 'stretch' with
   * a gap between each child.
   */
  justify?: 'center' | 'flex-start' | 'flex-end' | 'stretch'
  /** The space between children */
  gap?: number | string
}

type StackProps = StackBaseProps & (StackGapProps | StackJustifyProps)

const defaultElement = 'div' as const

/** ComplexGenericUnionIntersection description */
export const ComplexGenericUnionIntersection = <E extends React.ElementType = typeof defaultElement>(
  props: BoxProps<E, StackProps>
) => <div />
