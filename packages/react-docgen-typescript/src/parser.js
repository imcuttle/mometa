'use strict'
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k]
          }
        })
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        o[k2] = m[k]
      })
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v })
      }
    : function (o, v) {
        o['default'] = v
      })
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod
    var result = {}
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k)
    __setModuleDefault(result, mod)
    return result
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.getDefaultExportForFile =
  exports.Parser =
  exports.withCompilerOptions =
  exports.withCustomConfig =
  exports.withDefaultConfig =
  exports.parse =
  exports.defaultOptions =
  exports.defaultParserOpts =
    void 0
const fs = __importStar(require('fs'))
const path = __importStar(require('path'))
const ts = __importStar(require('typescript'))
const buildFilter_1 = require('./buildFilter')
const trimFileName_1 = require('./trimFileName')
exports.defaultParserOpts = {}
exports.defaultOptions = {
  jsx: ts.JsxEmit.React,
  module: ts.ModuleKind.CommonJS,
  target: ts.ScriptTarget.Latest
}
/**
 * Parses a file with default TS options
 * @param filePathOrPaths component file that should be parsed
 * @param parserOpts options used to parse the files
 */
function parse(filePathOrPaths, parserOpts = exports.defaultParserOpts) {
  return withCompilerOptions(exports.defaultOptions, parserOpts).parse(filePathOrPaths)
}
exports.parse = parse
/**
 * Constructs a parser for a default configuration.
 */
function withDefaultConfig(parserOpts = exports.defaultParserOpts) {
  return withCompilerOptions(exports.defaultOptions, parserOpts)
}
exports.withDefaultConfig = withDefaultConfig
/**
 * Constructs a parser for a specified tsconfig file.
 */
function withCustomConfig(tsconfigPath, parserOpts) {
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
exports.withCustomConfig = withCustomConfig
/**
 * Constructs a parser for a specified set of TS compiler options.
 */
function withCompilerOptions(compilerOptions, parserOpts = exports.defaultParserOpts) {
  return {
    parse(filePathOrPaths) {
      return parseWithProgramProvider(filePathOrPaths, compilerOptions, parserOpts)
    },
    parseWithProgramProvider(filePathOrPaths, programProvider) {
      return parseWithProgramProvider(filePathOrPaths, compilerOptions, parserOpts, programProvider)
    }
  }
}
exports.withCompilerOptions = withCompilerOptions
const isOptional = (prop) =>
  // tslint:disable-next-line:no-bitwise
  (prop.getFlags() & ts.SymbolFlags.Optional) !== 0
const defaultJSDoc = {
  description: '',
  fullComment: '',
  tags: {}
}
class Parser {
  constructor(program, opts) {
    const {
      savePropValueAsString,
      shouldExtractLiteralValuesFromEnum,
      shouldRemoveUndefinedFromOptional,
      shouldExtractValuesFromUnion,
      shouldIncludePropTagMap,
      shouldIncludeExpression
    } = opts
    this.checker = program.getTypeChecker()
    this.propFilter = (0, buildFilter_1.buildFilter)(opts)
    this.shouldExtractLiteralValuesFromEnum = Boolean(shouldExtractLiteralValuesFromEnum)
    this.shouldRemoveUndefinedFromOptional = Boolean(shouldRemoveUndefinedFromOptional)
    this.shouldExtractValuesFromUnion = Boolean(shouldExtractValuesFromUnion)
    this.savePropValueAsString = Boolean(savePropValueAsString)
    this.shouldIncludePropTagMap = Boolean(shouldIncludePropTagMap)
    this.shouldIncludeExpression = Boolean(shouldIncludeExpression)
  }
  getComponentFromExpression(exp) {
    const declaration = exp.valueDeclaration || exp.declarations[0]
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
  getComponentInfo(exp, source, componentNameResolver = () => undefined, customComponentTypes = []) {
    if (!!exp.declarations && exp.declarations.length === 0) {
      return null
    }
    let rootExp = this.getComponentFromExpression(exp)
    const declaration = rootExp.valueDeclaration || rootExp.declarations[0]
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
    let result = null
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
        const component = { name: displayName }
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
  extractPropsFromTypeIfStatelessComponent(type) {
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
  extractPropsFromTypeIfStatefulComponent(type) {
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
  extractMembersFromType(type) {
    const methodSymbols = []
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
  getMethodsInfo(type) {
    const members = this.extractMembersFromType(type)
    const methods = []
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
  getModifiers(member) {
    const modifiers = []
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
  getParameterInfo(callSignature) {
    return callSignature.parameters.map((param) => {
      const paramType = this.checker.getTypeOfSymbolAtLocation(param, param.valueDeclaration)
      const paramDeclaration = this.checker.symbolToParameterDeclaration(param, undefined, undefined)
      const isOptionalParam = !!(paramDeclaration && paramDeclaration.questionToken)
      return {
        description: ts.displayPartsToString(param.getDocumentationComment(this.checker)) || null,
        name: param.getName() + (isOptionalParam ? '?' : ''),
        type: { name: this.checker.typeToString(paramType) }
      }
    })
  }
  getCallSignature(symbol) {
    const symbolType = this.checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration)
    return symbolType.getCallSignatures()[0]
  }
  isTaggedPublic(symbol) {
    const jsDocTags = symbol.getJsDocTags()
    return Boolean(jsDocTags.find((tag) => tag.name === 'public'))
  }
  getReturnDescription(symbol) {
    const tags = symbol.getJsDocTags()
    const returnTag = tags.find((tag) => tag.name === 'returns')
    if (!returnTag || !Array.isArray(returnTag.text)) {
      return
    }
    return returnTag.text
  }
  getValuesFromUnionType(type) {
    if (type.isStringLiteral()) return `"${type.value}"`
    if (type.isNumberLiteral()) return `${type.value}`
    return this.checker.typeToString(type)
  }
  getInfoFromUnionType(type) {
    let commentInfo = {}
    if (type.getSymbol()) {
      commentInfo = Object.assign({}, this.getFullJsDocComment(type.getSymbol()))
    }
    return Object.assign({ value: this.getValuesFromUnionType(type) }, commentInfo)
  }
  getDocgenType(propType, isRequired) {
    // When we are going to process the type, we check if this type has a constraint (is a generic type with constraint)
    if (propType.getConstraint()) {
      // If so, we assing the property the type that is the constraint
      propType = propType.getConstraint()
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
  getPropsInfo(propsObj, defaultProps = {}) {
    if (!propsObj.valueDeclaration) {
      return {}
    }
    const propsType = this.checker.getTypeOfSymbolAtLocation(propsObj, propsObj.valueDeclaration)
    const baseProps = propsType.getApparentProperties()
    let propertiesOfProps = baseProps
    if (propsType.isUnionOrIntersection()) {
      propertiesOfProps = [
        // Resolve extra properties in the union/intersection
        ...(propertiesOfProps = this.checker.getAllPossiblePropertiesOfTypes(propsType.types)),
        // But props we already have override those as they are already correct.
        ...baseProps
      ]
      if (!propertiesOfProps.length) {
        const subTypes = this.checker.getAllPossiblePropertiesOfTypes(
          propsType.types.reduce(
            // @ts-ignore
            (all, t) => [...all, ...(t.types || [])],
            []
          )
        )
        propertiesOfProps = [...subTypes, ...baseProps]
      }
    }
    const result = {}
    propertiesOfProps.forEach((prop) => {
      const propName = prop.getName()
      // Find type of prop by looking in context of the props object itself.
      const propType = this.checker.getTypeOfSymbolAtLocation(prop, propsObj.valueDeclaration)
      const jsDocComment = this.findDocComment(prop)
      const hasCodeBasedDefault = defaultProps[propName] !== undefined
      let defaultValue = null
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
      result[propName] = Object.assign(
        { defaultValue, description: description, name: propName, parent, declarations: parents, required, type },
        propTags
      )
    })
    return result
  }
  findDocComment(symbol) {
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
  getFullJsDocComment(symbol) {
    // in some cases this can be undefined (Pick<Type, 'prop1'|'prop2'>)
    if (symbol.getDocumentationComment === undefined) {
      return defaultJSDoc
    }
    let mainComment = ts.displayPartsToString(symbol.getDocumentationComment(this.checker))
    if (mainComment) {
      mainComment = mainComment.replace(/\r\n/g, '\n')
    }
    const tags = symbol.getJsDocTags() || []
    const tagComments = []
    const tagMap = {}
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
  getFunctionStatement(statement) {
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
  extractDefaultPropsFromComponent(symbol, source) {
    let possibleStatements = [
      ...source.statements
        // ensure that name property is available
        .filter((stmt) => !!stmt.name)
        .filter((stmt) => this.checker.getSymbolAtLocation(stmt.name) === symbol),
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
        let initializer = defaultProps.initializer
        if (!initializer) {
          return res
        }
        let properties = initializer.properties
        while (ts.isIdentifier(initializer)) {
          const defaultPropsReference = this.checker.getSymbolAtLocation(initializer)
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
                  initializer = aliasedSymbol.declarations[0].initializer
                } else {
                  continue
                }
              } else {
                initializer = declarations[0].initializer
              }
              properties = initializer.properties
            }
          }
        }
        let propMap = {}
        if (properties) {
          propMap = this.getPropMap(properties)
        }
        return Object.assign(Object.assign({}, res), propMap)
      } else if (statementIsStatelessWithDefaultProps(statement)) {
        let propMap = {}
        statement.getChildren().forEach((child) => {
          let { right } = child
          if (right && ts.isIdentifier(right)) {
            const value = source.locals.get(right.escapedText)
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
            const { properties } = right
            if (properties) {
              propMap = this.getPropMap(properties)
            }
          }
        })
        return Object.assign(Object.assign({}, res), propMap)
      } else {
      }
      const functionStatement = this.getFunctionStatement(statement)
      // Extracting default values from props destructuring
      if (functionStatement && functionStatement.parameters && functionStatement.parameters.length) {
        const { name } = functionStatement.parameters[0]
        if (ts.isObjectBindingPattern(name)) {
          return Object.assign(Object.assign({}, res), this.getPropMap(name.elements))
        }
      }
      return res
    }, {})
  }
  getLiteralValueFromImportSpecifier(property) {
    if (ts.isImportSpecifier(property)) {
      const symbol = this.checker.getSymbolAtLocation(property.name)
      if (!symbol) {
        return null
      }
      const aliasedSymbol = this.checker.getAliasedSymbol(symbol)
      if (aliasedSymbol && aliasedSymbol.declarations && aliasedSymbol.declarations.length) {
        return this.getLiteralValueFromPropertyAssignment(aliasedSymbol.declarations[0])
      }
      return null
    }
    return null
  }
  getLiteralValueFromPropertyAssignment(property) {
    let { initializer } = property
    // Shorthand properties, so inflect their actual value
    if (!initializer) {
      if (ts.isShorthandPropertyAssignment(property)) {
        const symbol = this.checker.getShorthandAssignmentValueSymbol(property)
        const decl = symbol && symbol.valueDeclaration
        if (decl && decl.initializer) {
          initializer = decl.initializer
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
        return initializer.text.trim()
      case ts.SyntaxKind.PrefixUnaryExpression:
        return this.savePropValueAsString ? initializer.getFullText().trim() : Number(initializer.getFullText())
      case ts.SyntaxKind.NumericLiteral:
        return this.savePropValueAsString ? `${initializer.text}` : Number(initializer.text)
      case ts.SyntaxKind.NullKeyword:
        return this.savePropValueAsString ? 'null' : null
      case ts.SyntaxKind.Identifier:
        if (initializer.text === 'undefined') {
          return 'undefined'
        }
        const symbol = this.checker.getSymbolAtLocation(initializer)
        if (symbol && symbol.declarations && symbol.declarations.length) {
          if (ts.isImportSpecifier(symbol.declarations[0])) {
            return this.getLiteralValueFromImportSpecifier(symbol.declarations[0])
          }
          return this.getLiteralValueFromPropertyAssignment(symbol.declarations[0])
        }
        return null
      case ts.SyntaxKind.PropertyAccessExpression: {
        const symbol = this.checker.getSymbolAtLocation(initializer)
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
  getPropMap(properties) {
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
    }, {})
  }
}
exports.Parser = Parser
function statementIsClassDeclaration(statement) {
  return !!statement.members
}
function statementIsStatelessWithDefaultProps(statement) {
  const children = statement.getChildren()
  for (const child of children) {
    const { left } = child
    if (left) {
      const { name } = left
      if (name && name.escapedText === 'defaultProps') {
        return true
      }
    }
  }
  return false
}
function getPropertyName(name) {
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
function formatTag(tag) {
  let result = '@' + tag.name
  if (tag.text) {
    result += ' ' + ts.displayPartsToString(tag.text)
  }
  return result
}
function getTextValueOfClassMember(classDeclaration, memberName) {
  const classDeclarationMembers = classDeclaration.members || []
  const [textValue] =
    classDeclarationMembers &&
    classDeclarationMembers
      .filter((member) => ts.isPropertyDeclaration(member))
      .filter((member) => {
        const name = ts.getNameOfDeclaration(member)
        return name && name.text === memberName
      })
      .map((member) => {
        const property = member
        return property.initializer && property.initializer.text
      })
  return textValue || ''
}
function getTextValueOfFunctionProperty(exp, source, propertyName) {
  const [textValue] = source.statements
    .filter((statement) => ts.isExpressionStatement(statement))
    .filter((statement) => {
      const expr = statement.expression
      return expr.left && expr.left.name && expr.left.name.escapedText === propertyName
    })
    .filter((statement) => {
      return ts.isStringLiteral(statement.expression.right)
    })
    .map((statement) => {
      return statement.expression.right.text
    })
  return textValue || ''
}
function computeComponentName(exp, source, customComponentTypes = []) {
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
function getDefaultExportForFile(source) {
  const name = path.basename(source.fileName, path.extname(source.fileName))
  const filename = name === 'index' ? path.basename(path.dirname(source.fileName)) : name
  // JS identifiers must starts with a letter, and contain letters and/or numbers
  // So, you could not take filename as is
  const identifier = filename.replace(/^[^A-Z]*/gi, '').replace(/[^A-Z0-9]*/gi, '')
  return identifier.length ? identifier : 'DefaultName'
}
exports.getDefaultExportForFile = getDefaultExportForFile
function isTypeLiteral(node) {
  return node.kind === ts.SyntaxKind.TypeLiteral
}
function getDeclarations(prop) {
  const declarations = prop.getDeclarations()
  if (declarations === undefined || declarations.length === 0) {
    return undefined
  }
  const parents = []
  for (let declaration of declarations) {
    const { parent } = declaration
    if (!isTypeLiteral(parent) && !isInterfaceOrTypeAliasDeclaration(parent)) {
      continue
    }
    const parentName = 'name' in parent ? parent.name.text : 'TypeLiteral'
    const { fileName } = parent.getSourceFile()
    parents.push({
      fileName: (0, trimFileName_1.trimFileName)(fileName),
      name: parentName
    })
  }
  return parents
}
function getParentType(prop) {
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
    fileName: (0, trimFileName_1.trimFileName)(fileName),
    name: parentName
  }
}
function isInterfaceOrTypeAliasDeclaration(node) {
  return node.kind === ts.SyntaxKind.InterfaceDeclaration || node.kind === ts.SyntaxKind.TypeAliasDeclaration
}
function parseWithProgramProvider(filePathOrPaths, compilerOptions, parserOpts, programProvider) {
  const filePaths = Array.isArray(filePathOrPaths) ? filePathOrPaths : [filePathOrPaths]
  const program = programProvider ? programProvider() : ts.createProgram(filePaths, compilerOptions)
  const parser = new Parser(program, parserOpts)
  const checker = program.getTypeChecker()
  return filePaths
    .map((filePath) => program.getSourceFile(filePath))
    .filter((sourceFile) => typeof sourceFile !== 'undefined')
    .reduce((docs, sourceFile) => {
      const moduleSymbol = checker.getSymbolAtLocation(sourceFile)
      if (!moduleSymbol) {
        return docs
      }
      const components = checker.getExportsOfModule(moduleSymbol)
      const componentDocs = []
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
            componentDocs.push(
              Object.assign(Object.assign({}, doc), { displayName: `${exp.escapedName}.${symbol.escapedName}` })
            )
          }
        })
      })
      // Remove any duplicates (for HOC where the names are the same)
      const componentDocsNoDuplicates = componentDocs.reduce((prevVal, comp) => {
        const duplicate = prevVal.find((compDoc) => {
          return compDoc.displayName === comp.displayName
        })
        if (duplicate) return prevVal
        return [...prevVal, comp]
      }, [])
      const filteredComponentDocs = componentDocsNoDuplicates.filter((comp, index, comps) =>
        comps.slice(index + 1).every((innerComp) => innerComp.displayName !== comp.displayName)
      )
      return [...docs, ...filteredComponentDocs]
    }, [])
}
//# sourceMappingURL=parser.js.map
