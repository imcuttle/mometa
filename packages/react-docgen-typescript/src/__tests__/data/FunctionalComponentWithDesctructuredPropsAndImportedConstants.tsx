import * as React from 'react'

import {
  PROPERTY1_DEFAULT,
  PROPERTY2_DEFAULT,
  PROPERTY3_DEFAULT,
  PROPERTY4_DEFAULT,
  PROPERTY5_DEFAULT
} from './FunctionalComponentWithDesctructuredProps.constants'

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

/** FunctionalComponentWithDesctructuredPropsAndImportedConstants description */
const FunctionalComponentWithDesctructuredPropsAndImportedConstants: React.FC<Props> = ({
  prop1 = PROPERTY1_DEFAULT,
  prop2 = PROPERTY2_DEFAULT,
  prop3 = PROPERTY3_DEFAULT,
  prop4 = PROPERTY4_DEFAULT,
  prop5 = PROPERTY5_DEFAULT
}) => <div />

export default FunctionalComponentWithDesctructuredPropsAndImportedConstants
