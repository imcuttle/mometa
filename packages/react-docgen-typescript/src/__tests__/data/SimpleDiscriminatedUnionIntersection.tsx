type StackProps = { foo: string } & ({ bar: 'one'; test: number } | { bar: 'other'; baz: number })

/** SimpleDiscriminatedUnionIntersection description */
export const SimpleDiscriminatedUnionIntersection = (props: StackProps) => <div />
