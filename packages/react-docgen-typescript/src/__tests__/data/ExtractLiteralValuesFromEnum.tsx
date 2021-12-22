import * as React from 'react'

enum sampleEnum {
  ONE = 'one',
  TWO = 'two',
  THREE = 'three'
}

interface ExtractLiteralValuesFromEnumProps {
  /** sampleString description */
  sampleString: string
  /** sampleBoolean description */
  sampleBoolean: boolean
  /** sampleEnum description */
  sampleEnum: sampleEnum
}

export const Stateless: React.StatelessComponent<ExtractLiteralValuesFromEnumProps> = (props) => <div>test</div>
