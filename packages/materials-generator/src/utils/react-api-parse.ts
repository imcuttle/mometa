// import * as parser from '@mometa/react-docgen-typescript'
// import type {
//   PropFilter as IPropFilter,
//   PropItem as IPropItem,
//   StaticPropFilter
// } from '@mometa/react-docgen-typescript/lib/parser'
// import { buildFilter as getBuiltinFilter } from '@mometa/react-docgen-typescript/lib/buildFilter'
// import ts from 'typescript'
// import JsxEmit = ts.JsxEmit
//
// export interface IStaticPropFilter extends StaticPropFilter {
//   /**
//    * skip props which parsed from node_modules
//    */
//   skipNodeModules?: boolean
// }
//
// // ref: https://github.com/styleguidist/react-docgen-typescript/blob/048980a/src/parser.ts#L1110
// const DEFAULT_EXPORTS = [
//   'default',
//   '__function',
//   'Stateless',
//   'StyledComponentClass',
//   'StyledComponent',
//   'FunctionComponent', // React.FC
//   'StatelessComponent',
//   'ForwardRefExoticComponent'
// ]
//
// /**
//  * implement skipNodeModules filter option
//  * @param prop  api prop item, from parser
//  * @param opts  filter options
//  */
// function extraFilter(prop: IPropItem, opts: IStaticPropFilter) {
//   // check within node_modules
//   return !(opts.skipNodeModules && prop.declarations.find((d) => d.fileName.includes('node_modules')))
// }
//
// interface Entity {
//   identifier: string
//   description?: string
//   type: {
//     name: string
//     raw?: string
//     value?: any
//   }
//   default: any
// }
//
// export default function reactApiParse(
//   filePath: string,
//   { componentName, ...filterOpts }: IStaticPropFilter & { componentName?: string } = {}
// ): Record<string, Entity> {
//   let localFilter: any = filterOpts
//   localFilter = (
//     (mergedOpts): IPropFilter =>
//     (prop, component) => {
//       const builtinFilter = getBuiltinFilter({ propFilter: mergedOpts })
//
//       return builtinFilter(prop, component) && extraFilter(prop, mergedOpts)
//     }
//   )(localFilter)
//   const isDefaultRegExp = new RegExp(`^${componentName}$`, 'i')
//
//   let defaultDefinition
//
//   let definitions = {}
//   parser
//     .withCompilerOptions(
//       { esModuleInterop: true, jsx: JsxEmit.Preserve },
//       {
//         savePropValueAsString: true,
//         shouldExtractLiteralValuesFromEnum: true,
//         shouldRemoveUndefinedFromOptional: true,
//         componentNameResolver: (source, file, rawExp) => {
//           if (DEFAULT_EXPORTS.includes(source.getName())) {
//             return componentName
//           }
//           if (rawExp.getName() === 'default') {
//             return componentName
//           }
//         },
//         propFilter: localFilter
//       }
//     )
//     .parse(filePath)
//     .forEach((item) => {
//       // convert result to IApiDefinition
//       const exportName = isDefaultRegExp.test(item.displayName) ? 'default' : item.displayName
//       const props = Object.entries(item.props).map(([identifier, prop]) => {
//         const result = { identifier } as Entity
//         const fields = ['identifier', 'description', 'type', 'defaultValue', 'required']
//         const localeDescReg = /(?:^|\n+)@description\s+/
//
//         fields.forEach((field) => {
//           switch (field) {
//             case 'type':
//               result.type = prop.type
//               break
//
//             case 'description':
//               // the workaround way for support locale description
//               // detect locale description content, such as @description.zh-CN xxx
//               if (localeDescReg.test(prop.description)) {
//                 // split by @description symbol
//                 const groups = prop.description.split(localeDescReg).filter(Boolean)
//
//                 groups?.forEach((str) => {
//                   const [, locale, content] = str.match(/^(\.[\w-]+)?\s*([^]*)$/)
//
//                   result[`description${locale || ''}`] = content
//                 })
//               } else if (prop.description) {
//                 result.description = prop.description
//               }
//               break
//
//             case 'defaultValue':
//               if (prop[field]) {
//                 result.default = prop[field]
//               }
//               break
//
//             default:
//               if (prop[field]) {
//                 result[field] = prop[field]
//               }
//           }
//         })
//
//         return result
//       })
//
//       if (exportName === 'default') {
//         defaultDefinition = props
//       } else {
//         definitions[exportName] = props
//       }
//     })
//
//   // to make sure default export always in the top
//   if (defaultDefinition) {
//     definitions = Object.assign({ default: defaultDefinition }, definitions)
//   }
//
//   return definitions
// }
