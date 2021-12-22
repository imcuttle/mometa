import * as React from 'react'

interface RemoveOptionalValuesFromUnionProps {
  /** sampleStringUnion description */
  sampleStringUnion?: 'string1' | 'string2'
  /** sampleNumberUnion description */
  sampleNumberUnion?: 1 | 2 | 3
  /** sampleMixedUnion description */
  sampleMixedUnion?: 1 | 2 | 'string1' | 'string2'
}

export const Stateless: React.StatelessComponent<RemoveOptionalValuesFromUnionProps> = ({
  sampleStringUnion = 'string1',
  sampleNumberUnion = 1,
  sampleMixedUnion = 1
}) => <div>test</div>
