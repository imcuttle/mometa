import * as React from 'react'

/** Bar description */
const Bar: React.FC<{ foo: string }> = () => <div />
/** FooBar description */
const FooBar: React.FC<{ foobar: string }> = (props) => <div />

/** Baz description */
function Baz(props: { baz: string }) {
  return <div />
}

export { Bar, Baz, FooBar }
