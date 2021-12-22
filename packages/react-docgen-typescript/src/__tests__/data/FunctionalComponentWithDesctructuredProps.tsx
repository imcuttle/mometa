import * as React from 'react'

const PROPERTY1_DEFAULT = 'hello'
const PROPERTY2_DEFAULT = 'goodbye'
const PROPERTY3_DEFAULT = 10
const PROPERTY4_DEFAULT = 'this is a string'
const PROPERTY5_DEFAULT = true

type Property1Type = 'hello' | 'world'

type Props = {
  /** prop1 description */
  prop1?: Property1Type
  /** prop2 description */
  prop2?: 'goodbye' | 'farewell'
  /** prop3 description */
  prop3?: number
  /** prop4 description */
  prop4?: string
  /** prop5 description */
  prop5?: boolean
}

/** FunctionalComponentWithDesctructuredProps description */
const FunctionalComponentWithDesctructuredProps: React.FC<Props> = ({
  prop1 = PROPERTY1_DEFAULT,
  prop2 = PROPERTY2_DEFAULT,
  prop3 = PROPERTY3_DEFAULT,
  prop4 = PROPERTY4_DEFAULT,
  prop5 = PROPERTY5_DEFAULT
}) => <div />

export default FunctionalComponentWithDesctructuredProps
