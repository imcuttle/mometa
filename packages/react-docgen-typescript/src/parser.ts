import * as fs from 'fs'
import * as path from 'path'
import * as ts from 'typescript'

import { buildFilter } from './buildFilter'
import { SymbolDisplayPart } from 'typescript'
import { trimFileName } from './trimFileName'

type InterfaceOrTypeAliasDeclaration = ts.TypeAliasDeclaration | ts.InterfaceDeclaration
export interface StringIndexedObject<T> {
  [key: string]: T
}

export interface ComponentDoc {
  expression?: ts.Symbol
  displayName: string
  filePath: string
  description: string
  props: Props
  methods: Method[]
  tags?: StringIndexedObject<string>
}

export interface Props extends StringIndexedObject<PropItem> {}

export interface PropItem {
  name: string
  required: boolean
  type: PropItemType
  description: string
  defaultValue: any
  parent?: ParentType
  declarations?: ParentType[]
  tags?: {}
}

export interface Method {
  name: string
  docblock: string
  modifiers: string[]
  params: MethodParameter[]
  returns?: {
    description?: string | null
    type?: string
  } | null
  description: string
}

export interface MethodParameter {
  name: string
  description?: string | null
  type: MethodParameterType
}

export interface MethodParameterType {
  name: string
}

export interface Component {
  name: string
}

export interface PropItemType {
  name: string
  value?: any
  raw?: string
}

export interface ParentType {
  name: string
  fileName: string
}

export type PropFilter = (props: PropItem, component: Component) => boolean

export type ComponentNameResolver = (
  exp: ts.Symbol,
  source: ts.SourceFile,
  rawExp: ts.Symbol
) => string | undefined | null | false

export interface ParserOptions {
  propFilter?: StaticPropFilter | PropFilter
  componentNameResolver?: ComponentNameResolver
  shouldExtractLiteralValuesFromEnum?: boolean
  shouldRemoveUndefinedFromOptional?: boolean
  shouldExtractValuesFromUnion?: boolean
  skipChildrenPropWithoutDoc?: boolean
  savePropValueAsString?: boolean
  shouldIncludePropTagMap?: boolean
  shouldIncludeExpression?: boolean
  customComponentTypes?: string[]
}

export interface StaticPropFilter {
  skipPropsWithName?: string[] | string
  skipPropsWithoutDoc?: boolean
}

export const defaultParserOpts: ParserOptions = {}

export interface FileParser {
  parse(filePathOrPaths: string | string[]): ComponentDoc[]
  parseWithProgramProvider(filePathOrPaths: string | string[], programProvider?: () => ts.Program): ComponentDoc[]
}

export const defaultOptions: ts.CompilerOptions = {
  jsx: ts.JsxEmit.React,
  module: ts.ModuleKind.CommonJS,
  target: ts.ScriptTarget.Latest
}

/**
 * Parses a file with default TS options
 * @param filePathOrPaths component file that should be parsed
 * @param parserOpts options used to parse the files
 */
export function parse(filePathOrPaths: string | string[], parserOpts: ParserOptions = defaultParserOpts) {
  return withCompilerOptions(defaultOptions, parserOpts).parse(filePathOrPaths)
}

/**
 * Constructs a parser for a default configuration.
 */
export function withDefaultConfig(parserOpts: ParserOptions = defaultParserOpts): FileParser {
  return withCompilerOptions(defaultOptions, parserOpts)
}

/**
 * Constructs a parser for a specified tsconfig file.
 */
export function withCustomConfig(tsconfigPath: string, parserOpts: ParserOptions): FileParser {
  const basePath = path.dirname(tsconfigPath)
  const { config, error } = ts.readConfigFile(tsconfigPath, (filename) => fs.readFileSync(filename, 'utf8'))

  if (error !== undefined) {
    // tslint:disable-next-line: max-line-length
    const errorText = `Cannot load custom tsconfig.json from provided path: ${tsconfigPath}, with error code: ${error.code}, message: ${error.messageText}`
    throw new Error(errorText)
  }

  const { options, errors } = ts.parseJsonConfigFileContent(config, ts.sys, basePath, {}, tsconfigPath)

  if (errors && errors.length) {
    if (errors[0] instanceof Error) throw errors[0]
    else if (errors[0].messageText) throw new Error(`TS${errors[0].code}: ${errors[0].messageText}`)
    else throw new Error(JSON.stringify(errors[0]))
  }

  return withCompilerOptions(options, parserOpts)
}

/**
 * Constructs a parser for a specified set of TS compiler options.
 */
export function withCompilerOptions(
  compilerOptions: ts.CompilerOptions,
  parserOpts: ParserOptions = defaultParserOpts
): FileParser {
  return {
    parse(filePathOrPaths: string | string[]): ComponentDoc[] {
      return parseWithProgramProvider(filePathOrPaths, compilerOptions, parserOpts)
    },
    parseWithProgramProvider(filePathOrPaths, programProvider) {
      return parseWithProgramProvider(filePathOrPaths, compilerOptions, parserOpts, programProvider)
    }
  }
}

const isOptional = (prop: ts.Symbol) =>
  // tslint:disable-next-line:no-bitwise
  (prop.getFlags() & ts.SymbolFlags.Optional) !== 0

interface JSDoc {
  description: string
  fullComment: string
  tags: StringIndexedObject<string>
}

const defaultJSDoc: JSDoc = {
  description: '',
  fullComment: '',
  tags: {}
}

export class Parser {
  private readonly checker: ts.TypeChecker
  private readonly propFilter: PropFilter
  private readonly shouldRemoveUndefinedFromOptional: boolean
  private readonly shouldExtractLiteralValuesFromEnum: boolean
  private readonly shouldExtractValuesFromUnion: boolean
  private readonly savePropValueAsString: boolean
  private readonly shouldIncludePropTagMap: boolean
  private readonly shouldIncludeExpression: boolean

  constructor(program: ts.Program, opts: ParserOptions) {
    const {
      savePropValueAsString,
      shouldExtractLiteralValuesFromEnum,
      shouldRemoveUndefinedFromOptional,
      shouldExtractValuesFromUnion,
      shouldIncludePropTagMap,
      shouldIncludeExpression
    } = opts
    this.checker = program.getTypeChecker()
    this.propFilter = buildFilter(opts)
    this.shouldExtractLiteralValuesFromEnum = Boolean(shouldExtractLiteralValuesFromEnum)
    this.shouldRemoveUndefinedFromOptional = Boolean(shouldRemoveUndefinedFromOptional)
    this.shouldExtractValuesFromUnion = Boolean(shouldExtractValuesFromUnion)
    this.savePropValueAsString = Boolean(savePropValueAsString)
    this.shouldIncludePropTagMap = Boolean(shouldIncludePropTagMap)
    this.shouldIncludeExpression = Boolean(shouldIncludeExpression)
  }

  private getComponentFromExpression(exp: ts.Symbol) {
    const declaration = exp.valueDeclaration || exp.declarations![0]
    const type = this.checker.getTypeOfSymbolAtLocation(exp, declaration)
    const typeSymbol = type.symbol || type.aliasSymbol

    if (!typeSymbol) {
      return exp
    }

    const symbolName = typeSymbol.getName()

    if (
      (symbolName === 'MemoExoticComponent' || symbolName === 'ForwardRefExoticComponent') &&
      exp.valueDeclaration &&
      ts.isExportAssignment(exp.valueDeclaration) &&
      ts.isCallExpression(exp.valueDeclaration.expression)
    ) {
      const component = this.checker.getSymbolAtLocation(exp.valueDeclaration.expression.arguments[0])

      if (component) {
        exp = component
      }
    }

    return exp
  }

  public getComponentInfo(
    exp: ts.Symbol,
    source: ts.SourceFile,
    componentNameResolver: ComponentNameResolver = () => undefined,
    customComponentTypes: ParserOptions['customComponentTypes'] = []
  ): ComponentDoc | null {
    if (!!exp.declarations && exp.declarations.length === 0) {
      return null
    }

    let rootExp = this.getComponentFromExpression(exp)
    const declaration = rootExp.valueDeclaration || rootExp.declarations![0]
    const type = this.checker.getTypeOfSymbolAtLocation(rootExp, declaration)

    let commentSource = rootExp
    const typeSymbol = type.symbol || type.aliasSymbol
    const originalName = rootExp.getName()
    const filePath = source.fileName

    if (!rootExp.valueDeclaration) {
      if (!typeSymbol && (rootExp.flags & ts.SymbolFlags.Alias) !== 0) {
        commentSource = this.checker.getAliasedSymbol(commentSource)
      } else if (!typeSymbol) {
        return null
      } else {
        rootExp = typeSymbol
        const expName = rootExp.getName()

        const defaultComponentTypes = [
          '__function',
          'StatelessComponent',
          'Stateless',
          'StyledComponentClass',
          'StyledComponent',
          'FunctionComponent',
          'ForwardRefExoticComponent'
        ]

        const supportedComponentTypes = [...defaultComponentTypes, ...customComponentTypes]

        if (supportedComponentTypes.indexOf(expName) !== -1) {
          commentSource = this.checker.getAliasedSymbol(commentSource)
        } else {
          commentSource = rootExp
        }
      }
    } else if (type.symbol && (ts.isPropertyAccessExpression(declaration) || ts.isPropertyDeclaration(declaration))) {
      commentSource = type.symbol
    }

    // Skip over PropTypes that are exported
    if (typeSymbol && (typeSymbol.getEscapedName() === 'Requireable' || typeSymbol.getEscapedName() === 'Validator')) {
      return null
    }

    const propsType =
      this.extractPropsFromTypeIfStatelessComponent(type) || this.extractPropsFromTypeIfStatefulComponent(type)

    const nameSource = originalName === 'default' ? rootExp : commentSource
    const resolvedComponentName = componentNameResolver(nameSource, source, exp)
    const { description, tags } = this.findDocComment(commentSource)
    const displayName =
      resolvedComponentName || tags.visibleName || computeComponentName(nameSource, source, customComponentTypes)
    const methods = this.getMethodsInfo(type)

    let result: ComponentDoc | null = null
    if (propsType) {
      let defaultProps = {}
      if (!!commentSource.valueDeclaration) {
        defaultProps = this.extractDefaultPropsFromComponent(
          commentSource,
          commentSource.valueDeclaration.getSourceFile()
        )
      }
      const props = this.getPropsInfo(propsType, defaultProps)

      for (const propName of Object.keys(props)) {
        const prop = props[propName]
        const component: Component = { name: displayName }
        if (!this.propFilter(prop, component)) {
          delete props[propName]
        }
      }
      result = {
        tags,
        filePath,
        description,
        displayName,
        methods,
        props
      }
    } else if (description && displayName) {
      result = {
        tags,
        filePath,
        description,
        displayName,
        methods,
        props: {}
      }
    }

    if (result !== null && this.shouldIncludeExpression) {
      result.expression = rootExp
    }

    return result
  }

  public extractPropsFromTypeIfStatelessComponent(type: ts.Type): ts.Symbol | null {
    const callSignatures = type.getCallSignatures()

    if (callSignatures.length) {
      // Could be a stateless component.  Is a function, so the props object we're interested
      // in is the (only) parameter.

      for (const sig of callSignatures) {
        const params = sig.getParameters()
        if (params.length === 0) {
          continue
        }
        // Maybe we could check return type instead,
        // but not sure if Element, ReactElement<T> are all possible values
        const propsParam = params[0]
        if (propsParam.name === 'props' || params.length === 1) {
          return propsParam
        }
      }
    }

    return null
  }

  public extractPropsFromTypeIfStatefulComponent(type: ts.Type): ts.Symbol | null {
    const constructSignatures = type.getConstructSignatures()

    if (constructSignatures.length) {
      // React.Component. Is a class, so the props object we're interested
      // in is the type of 'props' property of the object constructed by the class.

      for (const sig of constructSignatures) {
        const instanceType = sig.getReturnType()
        const props = instanceType.getProperty('props')

        if (props) {
          return props
        }
      }
    }

    return null
  }

  public extractMembersFromType(type: ts.Type): ts.Symbol[] {
    const methodSymbols: ts.Symbol[] = []

    /**
     * Need to loop over properties first so we capture any
     * static methods. static methods aren't captured in type.symbol.members
     */
    type.getProperties().forEach((property) => {
      // Only add members, don't add non-member properties
      if (this.getCallSignature(property)) {
        methodSymbols.push(property)
      }
    })

    if (type.symbol && type.symbol.members) {
      type.symbol.members.forEach((member) => {
        methodSymbols.push(member)
      })
    }

    return methodSymbols
  }

  public getMethodsInfo(type: ts.Type): Method[] {
    const members = this.extractMembersFromType(type)
    const methods: Method[] = []
    members.forEach((member) => {
      if (!this.isTaggedPublic(member)) {
        return
      }

      const name = member.getName()
      const docblock = this.getFullJsDocComment(member).fullComment
      const callSignature = this.getCallSignature(member)
      const params = this.getParameterInfo(callSignature)
      const description = ts.displayPartsToString(member.getDocumentationComment(this.checker))
      const returnType = this.checker.typeToString(callSignature.getReturnType())
      const returnDescription = ts.displayPartsToString(this.getReturnDescription(member))
      const modifiers = this.getModifiers(member)

      methods.push({
        description,
        docblock,
        modifiers,
        name,
        params,
        returns: returnDescription
          ? {
              description: returnDescription,
              type: returnType
            }
          : null
      })
    })

    return methods
  }

  public getModifiers(member: ts.Symbol) {
    const modifiers: string[] = []
    if (!member.valueDeclaration) {
      return modifiers
    }

    const flags = ts.getCombinedModifierFlags(member.valueDeclaration)
    const isStatic = (flags & ts.ModifierFlags.Static) !== 0 // tslint:disable-line no-bitwise

    if (isStatic) {
      modifiers.push('static')
    }

    return modifiers
  }

  public getParameterInfo(callSignature: ts.Signature): MethodParameter[] {
    return callSignature.parameters.map((param) => {
      const paramType = this.checker.getTypeOfSymbolAtLocation(param, param.valueDeclaration!)
      const paramDeclaration = this.checker.symbolToParameterDeclaration(param, undefined, undefined)
      const isOptionalParam: boolean = !!(paramDeclaration && paramDeclaration.questionToken)

      return {
        description: ts.displayPartsToString(param.getDocumentationComment(this.checker)) || null,
        name: param.getName() + (isOptionalParam ? '?' : ''),
        type: { name: this.checker.typeToString(paramType) }
      }
    })
  }

  public getCallSignature(symbol: ts.Symbol) {
    const symbolType = this.checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!)

    return symbolType.getCallSignatures()[0]
  }

  public isTaggedPublic(symbol: ts.Symbol) {
    const jsDocTags = symbol.getJsDocTags()
    return Boolean(jsDocTags.find((tag) => tag.name === 'public'))
  }

  public getReturnDescription(symbol: ts.Symbol): SymbolDisplayPart[] | undefined {
    const tags = symbol.getJsDocTags()
    const returnTag = tags.find((tag) => tag.name === 'returns')
    if (!returnTag || !Array.isArray(returnTag.text)) {
      return
    }

    return returnTag.text
  }

  private getValuesFromUnionType(type: ts.Type): string | number {
    if (type.isStringLiteral()) return `"${type.value}"`
    if (type.isNumberLiteral()) return `${type.value}`
    return this.checker.typeToString(type)
  }

  private getInfoFromUnionType(type: ts.Type): {
    value: string | number
  } & Partial<JSDoc> {
    let commentInfo = {}
    if (type.getSymbol()) {
      commentInfo = { ...this.getFullJsDocComment(type.getSymbol()!) }
    }
    return {
      value: this.getValuesFromUnionType(type),
      ...commentInfo
    }
  }

  public getDocgenType(propType: ts.Type, isRequired: boolean): PropItemType {
    // When we are going to process the type, we check if this type has a constraint (is a generic type with constraint)
    if (propType.getConstraint()) {
      // If so, we assing the property the type that is the constraint
      propType = propType.getConstraint()!
    }

    let propTypeString = this.checker.typeToString(propType)
    if (this.shouldRemoveUndefinedFromOptional && !isRequired) {
      propTypeString = propTypeString.replace(' | undefined', '')
    }

    if (propType.isUnion()) {
      if (
        this.shouldExtractValuesFromUnion ||
        (this.shouldExtractLiteralValuesFromEnum &&
          propType.types.every(
            (type) =>
              type.getFlags() &
              (ts.TypeFlags.StringLiteral |
                ts.TypeFlags.NumberLiteral |
                ts.TypeFlags.EnumLiteral |
                ts.TypeFlags.Undefined)
          ))
      ) {
        let value = propType.types.map((type) => this.getInfoFromUnionType(type))

        if (this.shouldRemoveUndefinedFromOptional && !isRequired) {
          value = value.filter((option) => option.value != 'undefined')
        }

        return {
          name: 'enum',
          raw: propTypeString,
          value
        }
      }
    }

    if (this.shouldRemoveUndefinedFromOptional && !isRequired) {
      propTypeString = propTypeString.replace(' | undefined', '')
    }

    return { name: propTypeString }
  }

  public getPropsInfo(propsObj: ts.Symbol, defaultProps: StringIndexedObject<string> = {}): Props {
    if (!propsObj.valueDeclaration) {
      return {}
    }

    const propsType = this.checker.getTypeOfSymbolAtLocation(propsObj, propsObj.valueDeclaration)
    const baseProps = propsType.getApparentProperties()
    let propertiesOfProps = baseProps

    if (propsType.isUnionOrIntersection()) {
      propertiesOfProps = [
        // Resolve extra properties in the union/intersection
        ...(propertiesOfProps = (this.checker as any).getAllPossiblePropertiesOfTypes(propsType.types)),
        // But props we already have override those as they are already correct.
        ...baseProps
      ]

      if (!propertiesOfProps.length) {
        const subTypes = (this.checker as any).getAllPossiblePropertiesOfTypes(
          propsType.types.reduce<ts.Symbol[]>(
            // @ts-ignore
            (all, t) => [...all, ...(t.types || [])],
            []
          )
        )

        propertiesOfProps = [...subTypes, ...baseProps]
      }
    }

    const result: Props = {}

    propertiesOfProps.forEach((prop) => {
      const propName = prop.getName()

      // Find type of prop by looking in context of the props object itself.
      const propType = this.checker.getTypeOfSymbolAtLocation(prop, propsObj.valueDeclaration!)

      const jsDocComment = this.findDocComment(prop)
      const hasCodeBasedDefault = defaultProps[propName] !== undefined

      let defaultValue: { value: any } | null = null

      if (hasCodeBasedDefault) {
        defaultValue = { value: defaultProps[propName] }
      } else if (jsDocComment.tags.default) {
        defaultValue = { value: jsDocComment.tags.default }
      }

      const parent = getParentType(prop)
      const parents = getDeclarations(prop)
      const declarations = prop.declarations || []
      const baseProp = baseProps.find((p) => p.getName() === propName)

      const required =
        !isOptional(prop) &&
        !hasCodeBasedDefault &&
        // If in a intersection or union check original declaration for "?"
        // @ts-ignore
        declarations.every((d) => !d.questionToken) &&
        (!baseProp || !isOptional(baseProp))

      const type = jsDocComment.tags.type
        ? {
            name: jsDocComment.tags.type
          }
        : this.getDocgenType(propType, required)

      const propTags = this.shouldIncludePropTagMap ? { tags: jsDocComment.tags } : {}
      const description = this.shouldIncludePropTagMap
        ? jsDocComment.description.replace(/\r\n/g, '\n')
        : jsDocComment.fullComment.replace(/\r\n/g, '\n')

      result[propName] = {
        defaultValue,
        description: description,
        name: propName,
        parent,
        declarations: parents,
        required,
        type,
        ...propTags
      }
    })

    return result
  }

  public findDocComment(symbol: ts.Symbol): JSDoc {
    const comment = this.getFullJsDocComment(symbol)
    if (comment.fullComment || comment.tags.default) {
      return comment
    }

    const rootSymbols = this.checker.getRootSymbols(symbol)
    const commentsOnRootSymbols = rootSymbols
      .filter((x) => x !== symbol)
      .map((x) => this.getFullJsDocComment(x))
      .filter((x) => !!x.fullComment || !!comment.tags.default)

    if (commentsOnRootSymbols.length) {
      return commentsOnRootSymbols[0]
    }

    return defaultJSDoc
  }

  /**
   * Extracts a full JsDoc comment from a symbol, even
   * though TypeScript has broken down the JsDoc comment into plain
   * text and JsDoc tags.
   */
  public getFullJsDocComment(symbol: ts.Symbol): JSDoc {
    // in some cases this can be undefined (Pick<Type, 'prop1'|'prop2'>)
    if (symbol.getDocumentationComment === undefined) {
      return defaultJSDoc
    }

    let mainComment = ts.displayPartsToString(symbol.getDocumentationComment(this.checker))

    if (mainComment) {
      mainComment = mainComment.replace(/\r\n/g, '\n')
    }

    const tags = symbol.getJsDocTags() || []

    const tagComments: string[] = []
    const tagMap: StringIndexedObject<string> = {}

    tags.forEach((tag) => {
      const trimmedText = ts.displayPartsToString(tag.text).trim()
      const currentValue = tagMap[tag.name]
      tagMap[tag.name] = currentValue ? currentValue + '\n' + trimmedText : trimmedText

      if (['default', 'type'].indexOf(tag.name) < 0) {
        tagComments.push(formatTag(tag))
      }
    })

    return {
      description: mainComment,
      fullComment: (mainComment + '\n' + tagComments.join('\n')).trim(),
      tags: tagMap
    }
  }

  getFunctionStatement(statement: ts.Statement) {
    if (ts.isFunctionDeclaration(statement)) {
      return statement
    }

    if (ts.isVariableStatement(statement)) {
      let initializer = statement.declarationList && statement.declarationList.declarations[0].initializer

      // Look at forwardRef function argument
      if (initializer && ts.isCallExpression(initializer)) {
        const symbol = this.checker.getSymbolAtLocation(initializer.expression)
        if (!symbol || symbol.getName() !== 'forwardRef') return
        initializer = initializer.arguments[0]
      }

      if (initializer && (ts.isArrowFunction(initializer) || ts.isFunctionExpression(initializer))) {
        return initializer
      }
    }
  }

  public extractDefaultPropsFromComponent(symbol: ts.Symbol, source: ts.SourceFile) {
    let possibleStatements = [
      ...source.statements
        // ensure that name property is available
        .filter((stmt) => !!(stmt as ts.ClassDeclaration).name)
        .filter((stmt) => this.checker.getSymbolAtLocation((stmt as ts.ClassDeclaration).name!) === symbol),
      ...source.statements.filter((stmt) => ts.isExpressionStatement(stmt) || ts.isVariableStatement(stmt))
    ]

    return possibleStatements.reduce((res, statement) => {
      if (statementIsClassDeclaration(statement) && statement.members.length) {
        const possibleDefaultProps = statement.members.filter(
          (member) => member.name && getPropertyName(member.name) === 'defaultProps'
        )

        if (!possibleDefaultProps.length) {
          return res
        }

        const defaultProps = possibleDefaultProps[0]
        let initializer = (defaultProps as ts.PropertyDeclaration).initializer
        if (!initializer) {
          return res
        }
        let properties = (initializer as ts.ObjectLiteralExpression).properties

        while (ts.isIdentifier(initializer as ts.Identifier)) {
          const defaultPropsReference = this.checker.getSymbolAtLocation(initializer as ts.Node)
          if (defaultPropsReference) {
            const declarations = defaultPropsReference.getDeclarations()

            if (declarations) {
              if (ts.isImportSpecifier(declarations[0])) {
                var symbol = this.checker.getSymbolAtLocation(declarations[0].name)
                if (!symbol) {
                  continue
                }
                var aliasedSymbol = this.checker.getAliasedSymbol(symbol)
                if (aliasedSymbol && aliasedSymbol.declarations && aliasedSymbol.declarations.length) {
                  initializer = (aliasedSymbol.declarations[0] as ts.VariableDeclaration).initializer
                } else {
                  continue
                }
              } else {
                initializer = (declarations[0] as ts.VariableDeclaration).initializer
              }
              properties = (initializer as ts.ObjectLiteralExpression).properties
            }
          }
        }

        let propMap = {}

        if (properties) {
          propMap = this.getPropMap(properties as ts.NodeArray<ts.PropertyAssignment>)
        }

        return {
          ...res,
          ...propMap
        }
      } else if (statementIsStatelessWithDefaultProps(statement)) {
        let propMap = {}
        ;(statement as ts.ExpressionStatement).getChildren().forEach((child) => {
          let { right } = child as ts.BinaryExpression

          if (right && ts.isIdentifier(right)) {
            const value = ((source as any).locals as ts.SymbolTable).get(right.escapedText)

            if (
              value &&
              value.valueDeclaration &&
              ts.isVariableDeclaration(value.valueDeclaration) &&
              value.valueDeclaration.initializer
            ) {
              right = value.valueDeclaration.initializer
            }
          }

          if (right) {
            const { properties } = right as ts.ObjectLiteralExpression
            if (properties) {
              propMap = this.getPropMap(properties as ts.NodeArray<ts.PropertyAssignment>)
            }
          }
        })
        return {
          ...res,
          ...propMap
        }
      } else {
      }

      const functionStatement = this.getFunctionStatement(statement)

      // Extracting default values from props destructuring
      if (functionStatement && functionStatement.parameters && functionStatement.parameters.length) {
        const { name } = functionStatement.parameters[0]

        if (ts.isObjectBindingPattern(name)) {
          return {
            ...res,
            ...this.getPropMap(name.elements)
          }
        }
      }

      return res
    }, {})
  }

  public getLiteralValueFromImportSpecifier(
    property: ts.ImportSpecifier
  ): string | boolean | number | null | undefined {
    if (ts.isImportSpecifier(property)) {
      const symbol = this.checker.getSymbolAtLocation(property.name)

      if (!symbol) {
        return null
      }

      const aliasedSymbol = this.checker.getAliasedSymbol(symbol)
      if (aliasedSymbol && aliasedSymbol.declarations && aliasedSymbol.declarations.length) {
        return this.getLiteralValueFromPropertyAssignment(aliasedSymbol.declarations[0] as ts.BindingElement)
      }

      return null
    }

    return null
  }

  public getLiteralValueFromPropertyAssignment(
    property: ts.PropertyAssignment | ts.BindingElement
  ): string | boolean | number | null | undefined {
    let { initializer } = property

    // Shorthand properties, so inflect their actual value
    if (!initializer) {
      if (ts.isShorthandPropertyAssignment(property)) {
        const symbol = this.checker.getShorthandAssignmentValueSymbol(property)
        const decl = symbol && (symbol.valueDeclaration as ts.VariableDeclaration)

        if (decl && decl.initializer) {
          initializer = decl.initializer!
        }
      }
    }

    if (!initializer) {
      return undefined
    }

    // Literal values
    switch (initializer.kind) {
      case ts.SyntaxKind.FalseKeyword:
        return this.savePropValueAsString ? 'false' : false
      case ts.SyntaxKind.TrueKeyword:
        return this.savePropValueAsString ? 'true' : true
      case ts.SyntaxKind.StringLiteral:
        return (initializer as ts.StringLiteral).text.trim()
      case ts.SyntaxKind.PrefixUnaryExpression:
        return this.savePropValueAsString
          ? initializer.getFullText().trim()
          : Number((initializer as ts.PrefixUnaryExpression).getFullText())
      case ts.SyntaxKind.NumericLiteral:
        return this.savePropValueAsString
          ? `${(initializer as ts.NumericLiteral).text}`
          : Number((initializer as ts.NumericLiteral).text)
      case ts.SyntaxKind.NullKeyword:
        return this.savePropValueAsString ? 'null' : null
      case ts.SyntaxKind.Identifier:
        if ((initializer as ts.Identifier).text === 'undefined') {
          return 'undefined'
        }

        const symbol = this.checker.getSymbolAtLocation(initializer as ts.Identifier)

        if (symbol && symbol.declarations && symbol.declarations.length) {
          if (ts.isImportSpecifier(symbol.declarations[0])) {
            return this.getLiteralValueFromImportSpecifier(symbol.declarations[0] as ts.ImportSpecifier)
          }

          return this.getLiteralValueFromPropertyAssignment(symbol.declarations[0] as ts.BindingElement)
        }

        return null
      case ts.SyntaxKind.PropertyAccessExpression: {
        const symbol = this.checker.getSymbolAtLocation(initializer as ts.PropertyAccessExpression)

        if (symbol && symbol.declarations && symbol.declarations.length) {
          const declaration = symbol.declarations[0]

          if (ts.isBindingElement(declaration) || ts.isPropertyAssignment(declaration)) {
            return this.getLiteralValueFromPropertyAssignment(declaration)
          }
        }
      }
      case ts.SyntaxKind.ObjectLiteralExpression:
      default:
        try {
          return initializer.getText()
        } catch (e) {
          return null
        }
    }
  }

  public getPropMap(
    properties: ts.NodeArray<ts.PropertyAssignment | ts.BindingElement>
  ): StringIndexedObject<string | boolean | number | null> {
    return properties.reduce((acc, property) => {
      if (ts.isSpreadAssignment(property) || !property.name) {
        return acc
      }

      const literalValue = this.getLiteralValueFromPropertyAssignment(property)
      const propertyName = getPropertyName(property.name)

      if (
        (typeof literalValue === 'string' ||
          typeof literalValue === 'number' ||
          typeof literalValue === 'boolean' ||
          literalValue === null) &&
        propertyName !== null
      ) {
        acc[propertyName] = literalValue
      }

      return acc
    }, {} as StringIndexedObject<string | boolean | number | null>)
  }
}

function statementIsClassDeclaration(statement: ts.Statement): statement is ts.ClassDeclaration {
  return !!(statement as ts.ClassDeclaration).members
}

function statementIsStatelessWithDefaultProps(statement: ts.Statement): boolean {
  const children = (statement as ts.ExpressionStatement).getChildren()
  for (const child of children) {
    const { left } = child as ts.BinaryExpression
    if (left) {
      const { name } = left as ts.PropertyAccessExpression
      if (name && name.escapedText === 'defaultProps') {
        return true
      }
    }
  }
  return false
}

function getPropertyName(name: ts.PropertyName | ts.BindingPattern): string | null {
  switch (name.kind) {
    case ts.SyntaxKind.NumericLiteral:
    case ts.SyntaxKind.StringLiteral:
    case ts.SyntaxKind.Identifier:
      return name.text
    case ts.SyntaxKind.ComputedPropertyName:
      return name.getText()
    default:
      return null
  }
}

function formatTag(tag: ts.JSDocTagInfo) {
  let result = '@' + tag.name
  if (tag.text) {
    result += ' ' + ts.displayPartsToString(tag.text)
  }
  return result
}

function getTextValueOfClassMember(classDeclaration: ts.ClassDeclaration, memberName: string): string {
  const classDeclarationMembers = classDeclaration.members || []
  const [textValue] =
    classDeclarationMembers &&
    (classDeclarationMembers as any)
      .filter((member) => ts.isPropertyDeclaration(member))
      .filter((member) => {
        const name = ts.getNameOfDeclaration(member) as ts.Identifier
        return name && name.text === memberName
      })
      .map((member) => {
        const property = member as ts.PropertyDeclaration
        return property.initializer && (property.initializer as ts.Identifier).text
      })

  return textValue || ''
}

function getTextValueOfFunctionProperty(exp: ts.Symbol, source: ts.SourceFile, propertyName: string) {
  const [textValue] = source.statements
    .filter((statement) => ts.isExpressionStatement(statement))
    .filter((statement) => {
      const expr = (statement as ts.ExpressionStatement).expression as ts.BinaryExpression
      return (
        expr.left &&
        (expr.left as ts.PropertyAccessExpression).name &&
        (expr.left as ts.PropertyAccessExpression).name.escapedText === propertyName
      )
    })
    .filter((statement) => {
      return ts.isStringLiteral(((statement as ts.ExpressionStatement).expression as ts.BinaryExpression).right)
    })
    .map((statement) => {
      return (((statement as ts.ExpressionStatement).expression as ts.BinaryExpression).right as ts.Identifier).text
    })

  return textValue || ''
}

function computeComponentName(
  exp: ts.Symbol,
  source: ts.SourceFile,
  customComponentTypes: ParserOptions['customComponentTypes'] = []
) {
  const exportName = exp.getName()

  const statelessDisplayName = getTextValueOfFunctionProperty(exp, source, 'displayName')

  const statefulDisplayName =
    exp.valueDeclaration &&
    ts.isClassDeclaration(exp.valueDeclaration) &&
    getTextValueOfClassMember(exp.valueDeclaration, 'displayName')

  if (statelessDisplayName || statefulDisplayName) {
    return statelessDisplayName || statefulDisplayName || ''
  }

  const defaultComponentTypes = [
    'default',
    '__function',
    'Stateless',
    'StyledComponentClass',
    'StyledComponent',
    'FunctionComponent',
    'StatelessComponent',
    'ForwardRefExoticComponent'
  ]

  const supportedComponentTypes = [...defaultComponentTypes, ...customComponentTypes]

  if (supportedComponentTypes.indexOf(exportName) !== -1) {
    return getDefaultExportForFile(source)
  } else {
    return exportName
  }
}

// Default export for a file: named after file
export function getDefaultExportForFile(source: ts.SourceFile) {
  const name = path.basename(source.fileName, path.extname(source.fileName))
  const filename = name === 'index' ? path.basename(path.dirname(source.fileName)) : name

  // JS identifiers must starts with a letter, and contain letters and/or numbers
  // So, you could not take filename as is
  const identifier = filename.replace(/^[^A-Z]*/gi, '').replace(/[^A-Z0-9]*/gi, '')

  return identifier.length ? identifier : 'DefaultName'
}

function isTypeLiteral(node: ts.Node): node is ts.TypeLiteralNode {
  return node.kind === ts.SyntaxKind.TypeLiteral
}

function getDeclarations(prop: ts.Symbol): ParentType[] | undefined {
  const declarations = prop.getDeclarations()

  if (declarations === undefined || declarations.length === 0) {
    return undefined
  }

  const parents: ParentType[] = []

  for (let declaration of declarations) {
    const { parent } = declaration

    if (!isTypeLiteral(parent) && !isInterfaceOrTypeAliasDeclaration(parent)) {
      continue
    }

    const parentName = 'name' in parent ? (parent as InterfaceOrTypeAliasDeclaration).name.text : 'TypeLiteral'

    const { fileName } = (parent as InterfaceOrTypeAliasDeclaration | ts.TypeLiteralNode).getSourceFile()

    parents.push({
      fileName: trimFileName(fileName),
      name: parentName
    })
  }

  return parents
}

function getParentType(prop: ts.Symbol): ParentType | undefined {
  const declarations = prop.getDeclarations()

  if (declarations == null || declarations.length === 0) {
    return undefined
  }

  // Props can be declared only in one place
  const { parent } = declarations[0]

  if (!isInterfaceOrTypeAliasDeclaration(parent)) {
    return undefined
  }

  const parentName = parent.name.text
  const { fileName } = parent.getSourceFile()

  return {
    fileName: trimFileName(fileName),
    name: parentName
  }
}

function isInterfaceOrTypeAliasDeclaration(node: ts.Node): node is ts.InterfaceDeclaration | ts.TypeAliasDeclaration {
  return node.kind === ts.SyntaxKind.InterfaceDeclaration || node.kind === ts.SyntaxKind.TypeAliasDeclaration
}

function parseWithProgramProvider(
  filePathOrPaths: string | string[],
  compilerOptions: ts.CompilerOptions,
  parserOpts: ParserOptions,
  programProvider?: () => ts.Program
): ComponentDoc[] {
  const filePaths = Array.isArray(filePathOrPaths) ? filePathOrPaths : [filePathOrPaths]

  const program = programProvider ? programProvider() : ts.createProgram(filePaths, compilerOptions)

  const parser = new Parser(program, parserOpts)

  const checker = program.getTypeChecker()

  return filePaths
    .map((filePath) => program.getSourceFile(filePath))
    .filter((sourceFile): sourceFile is ts.SourceFile => typeof sourceFile !== 'undefined')
    .reduce<ComponentDoc[]>((docs, sourceFile) => {
      const moduleSymbol = checker.getSymbolAtLocation(sourceFile)

      if (!moduleSymbol) {
        return docs
      }

      const components = checker.getExportsOfModule(moduleSymbol)
      const componentDocs: ComponentDoc[] = []

      // First document all components
      components.forEach((exp) => {
        const doc = parser.getComponentInfo(
          exp,
          sourceFile,
          parserOpts.componentNameResolver,
          parserOpts.customComponentTypes
        )

        if (doc) {
          componentDocs.push(doc)
        }

        if (!exp.exports) {
          return
        }

        // Then document any static sub-components
        exp.exports.forEach((symbol) => {
          if (symbol.flags & ts.SymbolFlags.Prototype) {
            return
          }

          if (symbol.flags & ts.SymbolFlags.Method) {
            const signature = parser.getCallSignature(symbol)
            const returnType = checker.typeToString(signature.getReturnType())

            if (returnType !== 'Element') {
              return
            }
          }

          const doc = parser.getComponentInfo(
            symbol,
            sourceFile,
            parserOpts.componentNameResolver,
            parserOpts.customComponentTypes
          )

          if (doc) {
            componentDocs.push({
              ...doc,
              displayName: `${exp.escapedName}.${symbol.escapedName}`
            })
          }
        })
      })

      // Remove any duplicates (for HOC where the names are the same)
      const componentDocsNoDuplicates = componentDocs.reduce((prevVal, comp) => {
        const duplicate = prevVal.find((compDoc) => {
          return compDoc!.displayName === comp!.displayName
        })
        if (duplicate) return prevVal
        return [...prevVal, comp]
      }, [] as ComponentDoc[])

      const filteredComponentDocs = componentDocsNoDuplicates.filter((comp, index, comps) =>
        comps.slice(index + 1).every((innerComp) => innerComp!.displayName !== comp!.displayName)
      )

      return [...docs, ...filteredComponentDocs]
    }, [])
}
