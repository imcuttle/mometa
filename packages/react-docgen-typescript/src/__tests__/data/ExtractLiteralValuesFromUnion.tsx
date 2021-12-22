import * as React from 'react'

interface ExtractLiteralValuesFromUnionProps {
  /** sampleStringUnion description */
  sampleStringUnion: 'string1' | 'string2'
  /** sampleNumberUnion description */
  sampleNumberUnion: 1 | 2 | 3
  /** sampleComplexUnion description */
  sampleComplexUnion: number | 'string1' | 'string2'
  /** sampleMixedUnion description */
  sampleMixedUnion: 1 | 2 | 'string1' | 'string2'
}

export const Stateless: React.StatelessComponent<ExtractLiteralValuesFromUnionProps> = (props) => <div>test</div>
