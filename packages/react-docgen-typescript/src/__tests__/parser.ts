import { assert } from 'chai'
import * as fs from 'fs'
import * as path from 'path'
import * as ts from 'typescript'
import { getDefaultExportForFile, parse, PropFilter, withCustomConfig, withDefaultConfig } from '../parser'
import { check, checkComponent, fixturePath } from './testUtils'

describe('parser', () => {
  it('should parse simple react class component', () => {
    check('Column', {
      Column: {
        prop1: { type: 'string', required: false },
        prop2: { type: 'number' },
        prop3: { type: '() => void' },
        prop4: { type: '"option1" | "option2" | "option3"' }
      }
    })
  })

  it('should parse simple react class component with console.log inside', () => {
    check('ColumnWithLog', {
      Column: {
        prop1: { type: 'string', required: false },
        prop2: { type: 'number' },
        prop3: { type: '() => void' },
        prop4: { type: '"option1" | "option2" | "option3"' }
      }
    })
  })

  it('should parse simple react class component as default export', () => {
    check('ColumnWithDefaultExport', {
      Column: {
        prop1: { type: 'string', required: false },
        prop2: { type: 'number' },
        prop3: { type: '() => void' },
        prop4: { type: '"option1" | "option2" | "option3"' }
      }
    })
  })

  describe('file path', () => {
    it('should return the correct filepath for a parsed component', () => {
      const results = parse([fixturePath('FilePathCheck')])
      results.forEach((result) => {
        assert.equal(result.filePath, path.resolve('src/__tests__/data/FilePathCheck.tsx'))
      })
    })

    it('should return the correct filepath for multiple parsed components', () => {
      const results = parse([
        fixturePath('FilePathCheck'),
        fixturePath('Column'),
        fixturePath('ColumnWithDefaultExportOnly')
      ])
      const paths = [
        path.resolve('src/__tests__/data/FilePathCheck.tsx'),
        path.resolve('src/__tests__/data/Column.tsx'),
        path.resolve('src/__tests__/data/ColumnWithDefaultExportOnly.tsx')
      ]
      results.forEach((result, index) => {
        assert.equal(result.filePath, paths[index])
      })
    })
  })

  it('should parse mulitple files', () => {
    const result = parse([fixturePath('Column'), fixturePath('ColumnWithDefaultExportOnly')])

    checkComponent(
      result,
      {
        Column: {},
        ColumnWithDefaultExportOnly: {}
      },
      false
    )
  })

  it('should parse simple react class component as default export only', () => {
    check('ColumnWithDefaultExportOnly', {
      ColumnWithDefaultExportOnly: {
        prop1: { type: 'string', required: false },
        prop2: { type: 'number' },
        prop3: { type: '() => void' },
        prop4: { type: '"option1" | "option2" | "option3"' }
      }
    })
  })

  it('should parse simple react class component as default anonymous export', () => {
    check('ColumnWithDefaultAnonymousExportOnly', {
      ColumnWithDefaultAnonymousExportOnly: {
        prop1: { type: 'string', required: false },
        prop2: { type: 'number' },
        prop3: { type: '() => void' },
        prop4: { type: '"option1" | "option2" | "option3"' }
      }
    })
  })

  it('should parse simple react class component with state', () => {
    check('AppMenu', {
      AppMenu: {
        menu: { type: 'any' }
      }
    })
  })

  it('should parse simple react class component with picked properties', () => {
    check('ColumnWithPick', {
      Column: {
        prop1: { type: 'string', required: false },
        prop2: { type: 'number' },
        propx: { type: 'number' }
      }
    })
  })

  it('should parse component with props with external type', () => {
    check('ColumnWithPropsWithExternalType', {
      ColumnWithPropsWithExternalType: {
        prop1: { type: 'string', required: false },
        prop2: { type: 'number' },
        prop3: { type: 'MyExternalType' }
      }
    })
  })

  it('should parse HOCs', () => {
    check('ColumnHigherOrderComponent', {
      ColumnExternalHigherOrderComponent: {
        prop1: { type: 'string' }
      },
      ColumnHigherOrderComponent1: {
        prop1: { type: 'string' }
      },
      ColumnHigherOrderComponent2: {
        prop1: { type: 'string' }
      },
      RowExternalHigherOrderComponent: {
        prop1: { type: 'string' }
      },
      RowHigherOrderComponent1: {
        prop1: { type: 'string' }
      },
      RowHigherOrderComponent2: {
        prop1: { type: 'string' }
      }
    })
  })

  it('should parse component with inherited properties HtmlAttributes<any>', () => {
    check(
      'ColumnWithHtmlAttributes',
      {
        Column: {
          // tslint:disable:object-literal-sort-keys
          prop1: { type: 'string', required: false },
          prop2: { type: 'number' },
          // HtmlAttributes
          defaultChecked: {
            type: 'boolean',
            required: false,
            description: ''
          }
          // ...
          // tslint:enable:object-literal-sort-keys
        }
      },
      false
    )
  })

  it('should parse component without exported props interface', () => {
    check('ColumnWithoutExportedProps', {
      Column: {
        prop1: { type: 'string', required: false },
        prop2: { type: 'number' }
      }
    })
  })

  it('should parse functional component exported as const', () => {
    check(
      'ConstExport',
      {
        Row: {
          prop1: { type: 'string', required: false },
          prop2: { type: 'number' }
        },
        // TODO: this wasn't there before, i would guess that that's correct
        test: {}
      },
      false
    )
  })

  it('should parse react component with properties defined in external file', () => {
    check('ExternalPropsComponent', {
      ExternalPropsComponent: {
        prop1: { type: 'string' }
      }
    })
  })

  it('should parse static sub components', () => {
    check('StatelessStaticComponents', {
      StatelessStaticComponents: {
        myProp: { type: 'string' }
      },
      'StatelessStaticComponents.Label': {
        title: { type: 'string' }
      }
    })
  })

  it('should parse static sub components on class components', () => {
    check('ColumnWithStaticComponents', {
      Column: {
        prop1: { type: 'string' }
      },
      'Column.Label': {
        title: { type: 'string' }
      },
      'Column.SubLabel': {}
    })
  })

  it('should parse react component with properties extended from an external .tsx file', () => {
    check('ExtendsExternalPropsComponent', {
      ExtendsExternalPropsComponent: {
        prop1: { type: 'number', required: false, description: 'prop1' },
        prop2: { type: 'string', required: false, description: 'prop2' }
      }
    })
  })

  it('should parse react component with properties defined as type', () => {
    check(
      'FlippableImage',
      {
        FlippableImage: {
          isFlippedX: { type: 'boolean', required: false },
          isFlippedY: { type: 'boolean', required: false }
        }
      },
      false
    )
  })

  it('should parse react component with const definitions', () => {
    check('InlineConst', {
      MyComponent: {
        foo: { type: 'any' }
      }
    })
  })

  it('should parse default interface export', () => {
    check('ExportsDefaultInterface', {
      Component: {
        foo: { type: 'any' }
      }
    })
  })

  it('should parse react component that exports a prop type const', () => {
    check('ExportsPropTypeShape', {
      ExportsPropTypes: {
        foo: { type: 'any' }
      }
    })
  })

  it('should parse react component that exports a prop type thats imported', () => {
    check('ExportsPropTypeImport', {
      ExportsPropTypes: {
        foo: { type: 'any' }
      }
    })
  })

  // see issue #132 (https://github.com/styleguidist/react-docgen-typescript/issues/132)
  it('should determine the parent fileName relative to the project directory', () => {
    check(
      'ExportsPropTypeImport',
      {
        ExportsPropTypes: {
          foo: {
            parent: {
              fileName: 'react-docgen-typescript/src/__tests__/data/ExportsPropTypeImport.tsx',
              name: 'ExportsPropTypesProps'
            },
            type: 'any'
          } as any
        }
      },
      true
    )
  })

  describe('component with default props', () => {
    const expectation = {
      ComponentWithDefaultProps: {
        sampleDefaultFromJSDoc: {
          defaultValue: 'hello',
          description: 'sample with default value',
          required: true,
          type: '"hello" | "goodbye"'
        },
        sampleFalse: {
          defaultValue: false,
          required: false,
          type: 'boolean'
        },
        sampleNull: { type: 'null', required: false, defaultValue: null },
        sampleNumber: { type: 'number', required: false, defaultValue: -1 },
        sampleObject: {
          defaultValue: `{ a: '1', b: 2, c: true, d: false, e: undefined, f: null, g: { a: '1' } }`,
          required: false,
          type: '{ [key: string]: any; }'
        },
        sampleString: {
          defaultValue: 'hello',
          required: false,
          type: 'string'
        },
        sampleTrue: { type: 'boolean', required: false, defaultValue: true },
        sampleUndefined: {
          defaultValue: 'undefined',
          required: false,
          type: 'any'
        }
      }
    }

    it('should parse defined props', () => {
      check('ComponentWithDefaultProps', expectation)
    })

    it('should parse referenced props', () => {
      check('ComponentWithReferencedDefaultProps', expectation)
    })
  })

  describe('component with @type jsdoc tag', () => {
    const expectation = {
      ComponentWithTypeJsDocTag: {
        sampleTypeFromJSDoc: {
          description: 'sample with custom type',
          required: true,
          type: 'string'
        }
      }
    }

    it('should parse defined props', () => {
      check('ComponentWithTypeJsDocTag', expectation)
    })
  })

  it('should parse react PureComponent', () => {
    check('PureRow', {
      Row: {
        prop1: { type: 'string', required: false },
        prop2: { type: 'number' }
      }
    })
  })

  it('should parse react PureComponent - regression test', () => {
    check(
      'Regression_v0_0_12',
      {
        Zoomable: {
          originX: { type: 'number' },
          originY: { type: 'number' },
          scaleFactor: { type: 'number' }
        }
      },
      false
    )
  })

  it('should parse react functional component', () => {
    check('Row', {
      Row: {
        prop1: { type: 'string', required: false },
        prop2: { type: 'number' }
      }
    })
  })

  it('should parse react stateless component', () => {
    check('Stateless', {
      Stateless: {
        myProp: { type: 'string' }
      }
    })
  })

  it('should get name for default export', () => {
    check(
      'ForwardRefDefaultExport',
      {
        ForwardRefDefaultExport: {
          myProp: { type: 'string' }
        }
      },
      false
    )
  })

  it('should get name for default export 2', () => {
    check(
      'ForwardRefDefaultExportAtExport',
      {
        ForwardRefDefaultExport: {
          myProp: { type: 'string' }
        }
      },
      false
    )
  })

  it('should component where last line is a comment', () => {
    check('ExportObject', {
      Baz: {
        baz: { description: '', type: 'string' }
      },
      Bar: {
        foo: { description: '', type: 'string' }
      },
      FooBar: {
        foobar: { description: '', type: 'string' }
      }
    })
  })

  it('should parse react stateless component with intersection props', () => {
    check('StatelessIntersectionProps', {
      StatelessIntersectionProps: {
        moreProp: { type: 'number' },
        myProp: { type: 'string' }
      }
    })
  })

  it('should parse react stateless component default props when declared as a normal function', () => {
    check('FunctionDeclarationDefaultProps', {
      FunctionDeclarationDefaultProps: {
        id: {
          defaultValue: 1,
          description: '',
          required: false,
          type: 'number'
        }
      }
    })
  })

  it('should parse react stateless component default props when declared as a normal function inside forwardRef', () => {
    check(
      'ForwardRefDefaultValues',
      {
        ForwardRefDefaultValues: {
          myProp: {
            defaultValue: "I'm default",
            description: 'myProp description',
            type: 'string',
            required: false
          }
        }
      },
      false,
      'ForwardRefDefaultValues description'
    )
  })

  it('should parse react stateless component with external intersection props', () => {
    check('StatelessIntersectionExternalProps', {
      StatelessIntersectionExternalProps: {
        myProp: { type: 'string' },
        prop1: { type: 'string', required: false }
      }
    })
  })

  it('should parse react stateless component with generic intersection props', () => {
    check('StatelessIntersectionGenericProps', {
      StatelessIntersectionGenericProps: {
        myProp: { type: 'string' }
      }
    })
  })

  it('should parse react stateless component with intersection + union props', () => {
    check('SimpleUnionIntersection', {
      SimpleUnionIntersection: {
        bar: { type: 'string', description: '' },
        baz: { type: 'string', description: '' },
        foo: { type: 'string', description: '' }
      }
    })
  })

  it('should parse react stateless component with intersection + union overlap props', () => {
    check('SimpleDiscriminatedUnionIntersection', {
      SimpleDiscriminatedUnionIntersection: {
        bar: { type: '"one" | "other"', description: '' },
        baz: { type: 'number', description: '' },
        foo: { type: 'string', description: '' },
        test: { type: 'number', description: '' }
      }
    })
  })

  it('should parse react stateless component with generic intersection + union overlap props - simple', () => {
    check('SimpleGenericUnionIntersection', {
      SimpleGenericUnionIntersection: {
        as: { type: 'unknown', description: '' },
        foo: {
          description: 'The foo prop should not repeat the description',
          required: false,
          type: '"red" | "blue"'
        },
        gap: {
          description: 'The space between children\nYou cannot use gap when using a "space" justify property',
          required: false,
          type: 'number'
        },
        hasWrap: { type: 'boolean', description: '', required: false }
      }
    })
  })

  it('should parse react stateless component with generic intersection + union overlap props', () => {
    check('ComplexGenericUnionIntersection', {
      ComplexGenericUnionIntersection: {
        as: {
          type: 'ElementType<any>',
          required: false,
          description: 'Render the component as another component'
        },
        align: {
          description: 'The flex "align" property',
          required: false,
          type: '"stretch" | "center" | "flex-start" | "flex-end"'
        },
        justify: {
          description:
            "Use flex 'center' | 'flex-start' | 'flex-end' | 'stretch' with\na gap between each child.\nUse flex 'space-between' | 'space-around' | 'space-evenly' and\nflex will space the children.",
          required: false,
          type: '"stretch" | "center" | "flex-start" | "flex-end" | "space-between" | "space-around" | "space-evenly"'
        },
        gap: {
          description: 'The space between children\nYou cannot use gap when using a "space" justify property',
          required: false,
          type: 'string | number'
        }
      }
    })
  })

  it('should parse react stateless component with generic intersection + union + omit overlap props', () => {
    check('ComplexGenericUnionIntersectionWithOmit', {
      ComplexGenericUnionIntersectionWithOmit: {
        as: {
          type: 'ElementType<any>',
          required: false,
          description: 'Render the component as another component'
        },
        align: {
          description: 'The flex "align" property',
          required: false,
          type: '"center" | "flex-start" | "flex-end" | "stretch"'
        },
        justify: {
          description:
            "Use flex 'center' | 'flex-start' | 'flex-end' | 'stretch' with\na gap between each child.\nUse flex 'space-between' | 'space-around' | 'space-evenly' and\nflex will space the children.",
          required: false,
          type: '"center" | "flex-start" | "flex-end" | "stretch" | "space-between" | "space-around" | "space-evenly"'
        },
        gap: {
          description: 'The space between children\nYou cannot use gap when using a "space" justify property',
          required: false,
          type: 'string | number'
        }
      }
    })
  })

  it('should parse react stateful component with intersection props', () => {
    check('StatefulIntersectionProps', {
      StatefulIntersectionProps: {
        moreProp: { type: 'number' },
        myProp: { type: 'string' }
      }
    })
  })

  it('should parse react stateful component with external intersection props', () => {
    check('StatefulIntersectionExternalProps', {
      StatefulIntersectionExternalProps: {
        myProp: { type: 'string' },
        prop1: { type: 'string', required: false }
      }
    })
  })

  it('should parse react stateful component (wrapped in HOC) with intersection props', () => {
    check('HOCIntersectionProps', {
      HOCIntersectionProps: {
        injected: { type: 'boolean' },
        myProp: { type: 'string' }
      }
    })
  })

  describe('stateless component with default props', () => {
    const expectation = {
      StatelessWithDefaultProps: {
        sampleDefaultFromJSDoc: {
          defaultValue: 'hello',
          description: 'sample with default value',
          required: true,
          type: '"hello" | "goodbye"'
        },
        sampleEnum: {
          defaultValue: 'enumSample.HELLO',
          required: false,
          type: 'enumSample'
        },
        sampleFalse: {
          defaultValue: false,
          required: false,
          type: 'boolean'
        },
        sampleNull: { type: 'null', required: false, defaultValue: null },
        sampleNumber: { type: 'number', required: false, defaultValue: -1 },
        sampleObject: {
          defaultValue: `{ a: '1', b: 2, c: true, d: false, e: undefined, f: null, g: { a: '1' } }`,
          required: false,
          type: '{ [key: string]: any; }'
        },
        sampleString: {
          defaultValue: 'hello',
          required: false,
          type: 'string'
        },
        sampleTrue: { type: 'boolean', required: false, defaultValue: true },
        sampleUndefined: {
          defaultValue: undefined,
          required: false,
          type: 'any'
        }
      }
    }

    it('should parse defined props', () => {
      check('StatelessWithDefaultProps', expectation)
    })

    it('should parse props with shorthands', () => {
      check('StatelessShorthandDefaultProps', {
        StatelessShorthandDefaultProps: {
          onCallback: {
            defaultValue: null,
            description: 'onCallback description',
            required: false,
            type: '() => void'
          },
          regularProp: {
            defaultValue: 'foo',
            description: 'regularProp description',
            required: false,
            type: 'string'
          },
          shorthandProp: {
            defaultValue: 123,
            description: 'shorthandProp description',
            required: false,
            type: 'number'
          }
        }
      })
    })

    it('supports destructuring', () => {
      check('StatelessWithDestructuredProps', expectation)
    })

    it('supports destructuring for arrow functions', () => {
      check('StatelessWithDestructuredPropsArrow', expectation)
    })

    it('supports typescript 3.0 style defaulted props', () => {
      check('StatelessWithDefaultPropsTypescript3', expectation)
    })
  })

  it('should parse components with unioned types', () => {
    check('OnlyDefaultExportUnion', {
      OnlyDefaultExportUnion: {
        content: { description: 'The content', type: 'string' }
      }
    })
  })

  it('should parse components with unioned types when re-exported as named export', () => {
    check(
      'OnlyDefaultExportUnionAsExport',
      {
        OnlyDefaultExportUnion: {
          content: { description: 'The content', type: 'string' }
        }
      },
      true,
      'OnlyDefaultExportUnion description'
    )
  })

  it('should parse jsdocs with the @default tag and no description', () => {
    check('StatelessWithDefaultOnlyJsDoc', {
      StatelessWithDefaultOnlyJsDoc: {
        myProp: { defaultValue: 'hello', description: '', type: 'string' }
      }
    })
  })

  it('should parse functional component component defined as function', () => {
    check('FunctionDeclaration', {
      Jumbotron: {
        prop1: { type: 'string', required: true }
      }
    })
  })

  it('should parse functional component component defined as const', () => {
    check('FunctionalComponentAsConst', {
      Jumbotron: {
        prop1: { type: 'string', required: true }
      }
    })
  })

  it('should parse functional component defined as const with default value assignments in immediately destructured props', () => {
    check('FunctionalComponentWithDesctructuredProps', {
      FunctionalComponentWithDesctructuredProps: {
        prop1: {
          type: 'Property1Type',
          required: false,
          defaultValue: 'hello'
        },
        prop2: {
          type: '"goodbye" | "farewell"',
          required: false,
          defaultValue: 'goodbye'
        },
        prop3: {
          type: 'number',
          required: false,
          defaultValue: 10
        },
        prop4: {
          type: 'string',
          required: false,
          defaultValue: 'this is a string'
        },
        prop5: {
          type: 'boolean',
          required: false,
          defaultValue: true
        }
      }
    })
  })

  it('should parse functional component defined as const with default value (imported from a separate file) assignments in immediately destructured props', () => {
    check('FunctionalComponentWithDesctructuredPropsAndImportedConstants', {
      FunctionalComponentWithDesctructuredPropsAndImportedConstants: {
        prop1: {
          type: 'Property1Type',
          required: false,
          defaultValue: 'hello'
        },
        prop2: {
          type: '"goodbye" | "farewell"',
          required: false,
          defaultValue: 'goodbye'
        },
        prop3: {
          type: 'number',
          required: false,
          defaultValue: 10
        },
        prop4: {
          type: 'string',
          required: false,
          defaultValue: 'this is a string'
        },
        prop5: {
          type: 'boolean',
          required: false,
          defaultValue: true
        }
      }
    })
  })

  it('should parse functional component component defined as const', () => {
    check('FunctionDeclarationVisibleName', {
      'Awesome Jumbotron': {
        prop1: { type: 'string', required: true }
      }
    })
  })

  it('should parse React.SFC component defined as const', () => {
    check('ReactSFCAsConst', {
      Jumbotron: {
        prop1: { type: 'string', required: true }
      }
    })
  })

  it('should parse functional component component defined as function as default export', () => {
    check('FunctionDeclarationAsDefaultExport', {
      Jumbotron: {
        prop1: { type: 'string', required: true }
      }
    })
  })

  it('should parse functional component component thats been wrapped in React.memo', () => {
    check('FunctionDeclarationAsDefaultExportWithMemo', {
      Jumbotron: {
        prop1: { type: 'string', required: true }
      }
    })
  })

  it('should parse JSDoc correctly', () => {
    check(
      'JSDocWithParam',
      {
        JSDocWithParam: {
          prop1: { type: 'string', required: true }
        }
      },
      true,
      'JSDocWithParamProps description\n\nNOTE: If a parent element of this control is `overflow: hidden` then the\nballoon may not show up.'
    )
  })

  it('should parse functional component component defined as const as default export', () => {
    check(
      'FunctionalComponentAsConstAsDefaultExport',
      {
        // in this case the component name is taken from the file name
        FunctionalComponentAsConstAsDefaultExport: {
          prop1: { type: 'string', required: true }
        }
      },
      true,
      'Jumbotron description'
    )
  })

  it('should parse React.SFC component defined as const as default export', () => {
    check(
      'ReactSFCAsConstAsDefaultExport',
      {
        // in this case the component name is taken from the file name
        ReactSFCAsConstAsDefaultExport: {
          prop1: { type: 'string', required: true }
        }
      },
      true,
      'Jumbotron description'
    )
  })

  it('should parse functional component component defined as const as named export', () => {
    check(
      'FunctionalComponentAsConstAsNamedExport',
      {
        // in this case the component name is taken from the file name
        Jumbotron: {
          prop1: { type: 'string', required: true }
        }
      },
      true,
      'Jumbotron description'
    )
  })

  it('should parse React.SFC component defined as const as named export', () => {
    check(
      'ReactSFCAsConstAsNamedExport',
      {
        // in this case the component name is taken from the file name
        Jumbotron: {
          prop1: { type: 'string', required: true }
        }
      },
      true,
      'Jumbotron description'
    )
  })

  describe('displayName', () => {
    it('should be taken from stateless component `displayName` property (using named export)', () => {
      const [parsed] = parse(fixturePath('StatelessDisplayName'))
      assert.equal(parsed.displayName, 'StatelessDisplayName')
    })

    it('should be taken from stateful component `displayName` property (using named export)', () => {
      const [parsed] = parse(fixturePath('StatefulDisplayName'))
      assert.equal(parsed.displayName, 'StatefulDisplayName')
    })

    it('should be taken from stateless component `displayName` property (using default export)', () => {
      const [parsed] = parse(fixturePath('StatelessDisplayNameDefaultExport'))
      assert.equal(parsed.displayName, 'StatelessDisplayNameDefaultExport')
    })

    it("should be taken from stateless component `displayName` property (using default export) even if file name doesn't match", () => {
      const [parsed] = parse(fixturePath('StatelessDisplayNameDefaultExportDifferentFilename'))
      assert.equal(parsed.displayName, 'ThisNameIsNotTheSameAsThisFilename')
    })

    it('should be taken from stateful component `displayName` property (using default export)', () => {
      const [parsed] = parse(fixturePath('StatefulDisplayNameDefaultExport'))
      assert.equal(parsed.displayName, 'StatefulDisplayNameDefaultExport')
    })

    it('should be taken from named export when default export is an HOC', () => {
      const [parsed] = parse(fixturePath('StatelessDisplayNameHOC'))
      assert.equal(parsed.displayName, 'StatelessDisplayName')
    })

    it('should be taken from named export when default export is an HOC', () => {
      const [parsed] = parse(fixturePath('StatefulDisplayNameHOC'))
      assert.equal(parsed.displayName, 'StatefulDisplayName')
    })

    it('should be taken from stateless component folder name if file name is "index"', () => {
      const [parsed] = parse(fixturePath('StatelessDisplayNameFolder/index'))
      assert.equal(parsed.displayName, 'StatelessDisplayNameFolder')
    })

    it('should be taken from stateful component folder name if file name is "index"', () => {
      const [parsed] = parse(fixturePath('StatefulDisplayNameFolder/index'))
      assert.equal(parsed.displayName, 'StatefulDisplayNameFolder')
    })
  })

  describe('Parser options', () => {
    describe('Property filtering', () => {
      describe('children', () => {
        it('should ignore property "children" if not explicitly documented', () => {
          check(
            'Column',
            {
              Column: {
                prop1: { type: 'string', required: false },
                prop2: { type: 'number' },
                prop3: { type: '() => void' },
                prop4: { type: '"option1" | "option2" | "option3"' }
              }
            },
            true
          )
        })

        it('should not ignore any property that is documented explicitly', () => {
          check(
            'ColumnWithAnnotatedChildren',
            {
              Column: {
                children: {
                  description: 'children description',
                  required: false,
                  type: 'ReactNode'
                },
                prop1: { type: 'string', required: false },
                prop2: { type: 'number' },
                prop3: { type: '() => void' },
                prop4: { type: '"option1" | "option2" | "option3"' }
              }
            },
            true
          )
        })
      })

      describe('propsFilter method', () => {
        it('should apply filter function and filter components accordingly', () => {
          const propFilter: PropFilter = (prop, component) => prop.name !== 'prop1'
          check(
            'Column',
            {
              Column: {
                prop2: { type: 'number' },
                prop3: { type: '() => void' },
                prop4: { type: '"option1" | "option2" | "option3"' }
              }
            },
            true,
            undefined,
            { propFilter }
          )
        })

        it('should apply filter function and filter components accordingly', () => {
          const propFilter: PropFilter = (prop, component) => {
            if (component.name === 'Column') {
              return prop.name !== 'prop1'
            }
            return true
          }
          check(
            'Column',
            {
              Column: {
                prop2: { type: 'number' },
                prop3: { type: '() => void' },
                prop4: { type: '"option1" | "option2" | "option3"' }
              }
            },
            true,
            undefined,
            { propFilter }
          )
          check(
            'AppMenu',
            {
              AppMenu: {
                menu: { type: 'any' }
              }
            },
            true,
            undefined,
            { propFilter }
          )
        })

        it('should allow filtering by parent interface', () => {
          const propFilter: PropFilter = (prop, component) => {
            if (prop.parent == null) {
              return true
            }

            return prop.parent.fileName.indexOf('@types/react') < 0 && prop.parent.name !== 'HTMLAttributes'
          }

          check(
            'ColumnWithHtmlAttributes',
            {
              Column: {
                prop1: { type: 'string', required: false },
                prop2: { type: 'number' }
              }
            },
            true,
            undefined,
            { propFilter }
          )
        })
      })

      it('should collect all `onClick prop` parent declarations', (done) => {
        assert.doesNotThrow(() => {
          withDefaultConfig({
            propFilter: (prop) => {
              if (prop.name === 'onClick') {
                assert.deepEqual(prop.declarations, [
                  {
                    fileName: 'react-docgen-typescript/node_modules/@types/react/index.d.ts',
                    name: 'DOMAttributes'
                  },
                  {
                    fileName: 'react-docgen-typescript/src/__tests__/data/ButtonWithOnClickComponent.tsx',
                    name: 'TypeLiteral'
                  }
                ])

                done()
              }

              return true
            }
          }).parse(fixturePath('ButtonWithOnClickComponent'))
        })
      })

      it('should allow filtering by parent declarations', () => {
        const propFilter: PropFilter = (prop) => {
          if (prop.declarations !== undefined && prop.declarations.length > 0) {
            const hasPropAdditionalDescription = prop.declarations.find((declaration) => {
              return !declaration.fileName.includes('@types/react')
            })

            return Boolean(hasPropAdditionalDescription)
          }

          return true
        }

        check(
          'ButtonWithOnClickComponent',
          {
            ButtonWithOnClickComponent: {
              onClick: {
                type: 'MouseEventHandler<HTMLButtonElement>',
                required: false,
                description: 'onClick event handler'
              }
            }
          },
          true,
          '',
          {
            propFilter
          }
        )
      })

      describe('skipPropsWithName', () => {
        it('should skip a single property in skipPropsWithName', () => {
          const propFilter = { skipPropsWithName: 'prop1' }
          check(
            'Column',
            {
              Column: {
                prop2: { type: 'number' },
                prop3: { type: '() => void' },
                prop4: { type: '"option1" | "option2" | "option3"' }
              }
            },
            true,
            undefined,
            { propFilter }
          )
        })

        it('should skip multiple properties in skipPropsWithName', () => {
          const propFilter = { skipPropsWithName: ['prop1', 'prop2'] }
          check(
            'Column',
            {
              Column: {
                prop3: { type: '() => void' },
                prop4: { type: '"option1" | "option2" | "option3"' }
              }
            },
            true,
            undefined,
            { propFilter }
          )
        })
      })

      describe('skipPropsWithoutDoc', () => {
        it('should skip a properties without documentation', () => {
          const propFilter = { skipPropsWithoutDoc: false }
          check(
            'ColumnWithUndocumentedProps',
            {
              Column: {
                prop1: { type: 'string', required: false },
                prop2: { type: 'number' }
              }
            },
            true,
            undefined,
            { propFilter }
          )
        })
      })
    })

    it('should defaultProps in variable', () => {
      check('SeparateDefaultProps', {
        SeparateDefaultProps: {
          disabled: {
            description: '',
            required: false,
            defaultValue: false,
            type: 'boolean'
          },
          id: {
            description: '',
            required: false,
            defaultValue: 123,
            type: 'number'
          }
        }
      })
    })

    it('should defaultProps accessed variable', () => {
      check('SeparateDefaultPropsIndividual', {
        SeparateDefaultPropsIndividual: {
          disabled: {
            description: '',
            required: false,
            defaultValue: false,
            type: 'boolean'
          },
          id: {
            description: '',
            required: false,
            defaultValue: 123,
            type: 'number'
          }
        }
      })
    })

    describe('Extracting literal values from enums', () => {
      it('extracts literal values from enum', () => {
        check(
          'ExtractLiteralValuesFromEnum',
          {
            ExtractLiteralValuesFromEnum: {
              sampleBoolean: { type: 'boolean' },
              sampleEnum: {
                raw: 'sampleEnum',
                type: 'enum',
                value: [
                  {
                    value: '"one"',
                    description: '',
                    fullComment: '',
                    tags: {}
                  },
                  {
                    value: '"two"',
                    description: '',
                    fullComment: '',
                    tags: {}
                  },
                  {
                    value: '"three"',
                    description: '',
                    fullComment: '',
                    tags: {}
                  }
                ]
              },
              sampleString: { type: 'string' }
            }
          },
          true,
          null,
          {
            shouldExtractLiteralValuesFromEnum: true
          }
        )
      })

      it('Should infer types from constraint type (generic with extends)', () => {
        check(
          'GenericWithExtends',
          {
            GenericWithExtends: {
              sampleUnionProp: {
                raw: 'SampleUnion',
                type: 'enum',
                value: [
                  {
                    value: '"value 1"'
                  },
                  {
                    value: '"value 2"'
                  },
                  {
                    value: '"value 3"'
                  },
                  {
                    value: '"value 4"'
                  },
                  {
                    value: '"value n"'
                  }
                ]
              },
              sampleEnumProp: {
                raw: 'SampleEnum',
                type: 'enum',
                value: [
                  { value: '0', description: '', fullComment: '', tags: {} },
                  { value: '1', description: '', fullComment: '', tags: {} },
                  { value: '"c"', description: '', fullComment: '', tags: {} }
                ]
              },
              sampleUnionNonGeneric: {
                type: 'SampleUnionNonGeneric'
              },
              sampleObjectProp: {
                type: 'SampleObject'
              },
              sampleNumberProp: {
                type: 'number'
              },
              sampleGenericArray: {
                type: 'number[]'
              },
              sampleGenericObject: {
                type: '{ prop1: number; }'
              },
              sampleInlineObject: {
                type: '{ propA: string; }'
              }
            }
          },
          true,
          null,
          { shouldExtractLiteralValuesFromEnum: true }
        )
      })
    })

    describe('Extracting values from unions', () => {
      it('extracts all values from union', () => {
        check(
          'ExtractLiteralValuesFromUnion',
          {
            ExtractLiteralValuesFromUnion: {
              sampleComplexUnion: {
                raw: 'number | "string1" | "string2"',
                type: 'enum',
                value: [{ value: 'number' }, { value: '"string1"' }, { value: '"string2"' }]
              }
            }
          },
          false,
          null,
          {
            shouldExtractValuesFromUnion: true
          }
        )
      })
      it('extracts numbers from a union', () => {
        check(
          'ExtractLiteralValuesFromUnion',
          {
            ExtractLiteralValuesFromUnion: {
              sampleNumberUnion: {
                raw: '1 | 2 | 3',
                type: 'enum',
                value: [{ value: '1' }, { value: '2' }, { value: '3' }]
              }
            }
          },
          false,
          null,
          {
            shouldExtractValuesFromUnion: true
          }
        )
      })
      it('extracts numbers and strings from a mixed union', () => {
        check(
          'ExtractLiteralValuesFromUnion',
          {
            ExtractLiteralValuesFromUnion: {
              sampleMixedUnion: {
                raw: '"string1" | "string2" | 1 | 2',
                type: 'enum',
                value: [{ value: '"string1"' }, { value: '"string2"' }, { value: '1' }, { value: '2' }]
              }
            }
          },
          false,
          null,
          {
            shouldExtractValuesFromUnion: true
          }
        )
      })
    })

    describe('Returning not string default props ', () => {
      it('returns not string defaultProps', () => {
        check(
          'StatelessWithDefaultPropsAsString',
          {
            StatelessWithDefaultPropsAsString: {
              sampleFalse: {
                defaultValue: 'false',
                required: false,
                type: 'boolean'
              },
              sampleNull: {
                defaultValue: 'null',
                required: false,
                type: 'null'
              },
              sampleNumber: {
                defaultValue: '1',
                required: false,
                type: 'number'
              },
              sampleNumberWithPrefix: {
                defaultValue: '-1',
                required: false,
                type: 'number'
              },
              sampleTrue: {
                defaultValue: 'true',
                required: false,
                type: 'boolean'
              },
              sampleUndefined: {
                defaultValue: 'undefined',
                required: false,
                type: 'undefined'
              }
            }
          },
          true,
          null,
          {
            savePropValueAsString: true
          }
        )
      })
    })
    describe("Extract prop's JSDoc/TSDoc tags", () => {
      it('should extract all prop JSDoc/TSDoc tags', () => {
        check(
          'ExtractPropTags',
          {
            ExtractPropTags: {
              prop1: {
                type: 'Pick<Todo, "title" | "completed">',
                required: false,
                tags: {
                  ignore: 'ignoreMe',
                  kind: 'category 2',
                  custom123: 'something'
                }
              },
              prop2: {
                type: 'string',
                tags: { internal: 'some internal prop', kind: 'category 1' }
              }
            }
          },
          true,
          null,
          { shouldIncludePropTagMap: true }
        )
      })
    })

    describe('shouldIncludeExpression', () => {
      it('should be disabled by default', () => {
        const [parsed] = parse(fixturePath('StatelessDisplayName'))
        assert.equal(parsed.expression, undefined)
      })

      it('should cause the parser to return the component expression when set to true', () => {
        const [parsed] = parse(fixturePath('StatelessDisplayName'), {
          shouldIncludeExpression: true
        })
        assert.equal(parsed.expression!.name, 'Stateless')
      })
    })
  })

  describe('withCustomConfig', () => {
    it('should accept tsconfigs that typescript accepts', () => {
      assert.ok(
        withCustomConfig(
          // need to navigate to root because tests run on compiled tests
          // and tsc does not include json files
          path.join(__dirname, '../../src/__tests__/data/tsconfig.json'),
          {}
        )
      )
    })
  })

  describe('typescript strict mode', () => {
    // typescript strict mode adds an extra `undefined` to enums
    // may have other funky behavior
    describe('remove undefined from optional', () => {
      const options = {
        shouldExtractLiteralValuesFromEnum: true,
        shouldRemoveUndefinedFromOptional: true,
        savePropValueAsString: true
      }
      const parser = withCustomConfig(
        // tsconfig with strict: true
        path.join(__dirname, '../../src/__tests__/data/tsconfig.json'),
        options
      )
      it('removes undefined from enums', () => {
        const result = parser.parse(fixturePath('RemoveOptionalValuesFromEnum'))
        const expected = {
          RemoveOptionalValuesFromEnum: {
            sampleBoolean: { type: 'boolean', required: false },
            sampleEnum: {
              raw: 'sampleEnum',
              required: false,
              type: 'enum',
              value: [
                {
                  value: '"one"',
                  description: 'test comment',
                  fullComment: 'test comment',
                  tags: {}
                },
                { value: '"two"', description: '', fullComment: '', tags: {} },
                { value: '"three"', description: '', fullComment: '', tags: {} }
              ]
            },
            sampleString: { type: 'string', required: false }
          }
        }
        checkComponent(result, expected, false)
      })
      it('removes undefined from unions', () => {
        const result = parser.parse(fixturePath('RemoveOptionalValuesFromUnion'))
        const expected = {
          RemoveOptionalValuesFromUnion: {
            sampleStringUnion: {
              required: false,
              raw: '"string1" | "string2"',
              type: 'enum',
              value: [{ value: '"string1"' }, { value: '"string2"' }]
            },
            sampleNumberUnion: {
              required: false,
              raw: '1 | 2 | 3',
              type: 'enum',
              value: [{ value: '1' }, { value: '2' }, { value: '3' }]
            },
            sampleMixedUnion: {
              required: false,
              raw: '"string1" | "string2" | 1 | 2',
              type: 'enum',
              value: [{ value: '"string1"' }, { value: '"string2"' }, { value: '1' }, { value: '2' }]
            }
          }
        }
        check('RemoveOptionalValuesFromUnion', expected, false, null, options)
      })
    })
  })

  describe('parseWithProgramProvider', () => {
    it('should accept existing ts.Program instance', () => {
      let programProviderInvoked = false

      // mimic a third party library providing a ts.Program instance.
      const programProvider = () => {
        // need to navigate to root because tests run on compiled tests
        // and tsc does not include json files
        const tsconfigPath = path.join(__dirname, '../../src/__tests__/data/tsconfig.json')
        const basePath = path.dirname(tsconfigPath)

        const { config, error } = ts.readConfigFile(tsconfigPath, (filename) => fs.readFileSync(filename, 'utf8'))
        assert.isUndefined(error)

        const { options, errors } = ts.parseJsonConfigFileContent(config, ts.sys, basePath, {}, tsconfigPath)
        assert.lengthOf(errors, 0)

        programProviderInvoked = true

        return ts.createProgram([fixturePath('Column')], options)
      }

      const result = withDefaultConfig().parseWithProgramProvider([fixturePath('Column')], programProvider)

      checkComponent(
        result,
        {
          Column: {}
        },
        false
      )
      assert.isTrue(programProviderInvoked)
    })
  })

  describe('componentNameResolver', () => {
    it('should override default behavior', () => {
      const [parsed] = parse(fixturePath('StatelessDisplayNameStyledComponent'), {
        componentNameResolver: (exp, source) =>
          exp.getName() === 'StyledComponentClass' && getDefaultExportForFile(source)
      })
      assert.equal(parsed.displayName, 'StatelessDisplayNameStyledComponent')
    })

    it('should fallback to default behavior without a match', () => {
      const [parsed] = parse(fixturePath('StatelessDisplayNameStyledComponent'), {
        componentNameResolver: () => false
      })
      assert.equal(parsed.displayName, 'StatelessDisplayNameStyledComponent')
    })
  })

  describe('methods', () => {
    it('should properly parse methods', () => {
      const [parsed] = parse(fixturePath('ColumnWithMethods'))
      const methods = parsed.methods
      const myCoolMethod = methods[0]

      assert.equal(myCoolMethod.description, 'My super cool method')
      assert.equal(
        myCoolMethod.docblock,
        'My super cool method\n@param myParam Documentation for parameter 1\n@public\n@returns The answer to the universe' // tslint:disable-line max-line-length
      )
      assert.deepEqual(myCoolMethod.modifiers, [])
      assert.equal(myCoolMethod.name, 'myCoolMethod')
      assert.deepEqual(myCoolMethod.params, [
        {
          description: 'Documentation for parameter 1',
          name: 'myParam',
          type: { name: 'number' }
        },
        {
          description: null,
          name: 'mySecondParam?',
          type: { name: 'string' }
        }
      ])
      assert.deepEqual(myCoolMethod.returns, {
        description: 'The answer to the universe',
        type: 'number'
      })
    })

    it('should properly parse static methods', () => {
      const [parsed] = parse(fixturePath('ColumnWithStaticMethods'))
      const methods = parsed.methods

      assert.equal(methods[0].name, 'myStaticMethod')
      assert.deepEqual(methods[0].modifiers, ['static'])
    })

    it('should handle method with no information', () => {
      const [parsed] = parse(fixturePath('ColumnWithMethods'))
      const methods = parsed.methods
      assert.equal(methods[1].name, 'myBasicMethod')
    })

    it('should handle arrow function', () => {
      const [parsed] = parse(fixturePath('ColumnWithMethods'))
      const methods = parsed.methods
      assert.equal(methods[2].name, 'myArrowFunction')
    })

    it('should not parse functions not marked with @public', () => {
      const [parsed] = parse(fixturePath('ColumnWithMethods'))
      const methods = parsed.methods
      assert.equal(Boolean(methods.find((method) => method.name === 'myPrivateFunction')), false)
    })
  })

  describe('getDefaultExportForFile', () => {
    it('should filter out forbidden symbols', () => {
      const result = getDefaultExportForFile({
        fileName: 'a-b'
      } as ts.SourceFile)
      assert.equal(result, 'ab')
    })

    it('should remove leading non-letters', () => {
      const result = getDefaultExportForFile({
        fileName: '---123aba'
      } as ts.SourceFile)
      assert.equal(result, 'aba')
    })

    it('should preserve numbers in the middle', () => {
      const result = getDefaultExportForFile({
        fileName: '1Body2Text3'
      } as ts.SourceFile)
      assert.equal(result, 'Body2Text3')
    })

    it('should not return empty string', () => {
      const result = getDefaultExportForFile({
        fileName: '---123'
      } as ts.SourceFile)
      assert.equal(result.length > 0, true)
    })
  })

  describe('issues tests', () => {
    it('188', () => {
      check(
        'Issue188',
        {
          Header: {
            content: { type: 'string', required: true, description: '' }
          }
        },
        true,
        ''
      )
    })

    it('should return prop types for custom component type', () => {
      check(
        'Issue320',
        {
          Issue320: {
            color: {
              type: 'string',
              required: false,
              description: ''
            },
            text: { type: 'string', required: true, description: '' }
          }
        },
        true,
        null,
        {
          customComponentTypes: ['OverridableComponent'],
          savePropValueAsString: true
        }
      )
    })

    it('should parse imported default props for class component', () => {
      check(
        'ComponentWithImportedDefaultProps',
        {
          ComponentWithImportedDefaultProps: {
            name: {
              type: 'string',
              defaultValue: 'Node',
              required: false,
              description: ''
            }
          }
        },
        false,
        ''
      )
    })
  })
})
