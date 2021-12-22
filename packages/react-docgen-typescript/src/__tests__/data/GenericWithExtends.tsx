//In our case we have a component that works like the foolowing

type SampleUnion = 'value 1' | 'value 2' | 'value 3' | 'value 4' | 'value n'
enum SampleEnum {
  A,
  B,
  C = 'c'
}
type SampleObject = {
  propA: string
  propB: object
  propC: number
}
class Base {
  propA: string = 'A'
}
class SampleUnionNonGeneric extends Base {
  propB: string = 'B'
}

export const GenericWithExtends = <
  G extends SampleUnion,
  E extends SampleEnum,
  A extends number[],
  O extends { prop1: number }
>(props: {
  /** sampleUnionProp description */
  sampleUnionProp: G
  /** sampleEnumProp description */
  sampleEnumProp: E
  /** sampleUnionNonGeneric description */
  sampleUnionNonGeneric: SampleUnionNonGeneric
  /** sampleObjectProp description */
  sampleObjectProp: SampleObject
  /** sampleNumberProp description */
  sampleNumberProp: number
  /** sampleGenericArray description */
  sampleGenericArray: A
  /** sampleGenericObject description */
  sampleGenericObject: O
  /** sampleInlineObject description */
  sampleInlineObject: { propA: string }
}) => {
  return <div>test</div>
}
