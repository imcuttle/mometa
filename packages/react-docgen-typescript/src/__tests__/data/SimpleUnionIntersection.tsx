type StackProps = { foo: string } & ({ bar: string } | { baz: string })

/** SimpleUnionIntersection description */
export const SimpleUnionIntersection = (props: StackProps) => <div />
