import * as React from 'react'

enum sampleEnum {
  /** test comment */
  ONE = 'one',
  TWO = 'two',
  THREE = 'three'
}

interface RemoveOptionalValuesFromEnumProps {
  /** sampleString description */
  sampleString?: string
  /** sampleBoolean description */
  sampleBoolean?: boolean
  /** sampleEnum description */
  sampleEnum?: sampleEnum
}

/** RemoveOptionalValuesFromEnum description */
export const Stateless: React.StatelessComponent<RemoveOptionalValuesFromEnumProps> = ({
  sampleString = 'hello',
  sampleBoolean = true,
  sampleEnum = 'three'
}) => <div>test</div>
