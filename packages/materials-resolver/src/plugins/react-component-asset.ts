// import { Asset } from '../types'
// import * as fs from 'fs'
// import { pascalCase } from 'change-case'
// import * as nps from 'path'
// import reactApiParse from '../utils/react-api-parse'
//
// export function reactComponentAsset(
//   filename: string,
//   { componentName }: { componentName?: string } = {}
// ): Asset | null {
//   const basename = nps.basename(filename, nps.extname(filename))
//   const result = reactApiParse(filename, {
//     // button/index.jsx => Button
//     // src/button.js => Button
//     componentName:
//       componentName ??
//       pascalCase(['index', 'index.d'].includes(basename) ? nps.basename(nps.dirname(filename)) : basename)
//   })
//
//   console.log('result', JSON.stringify(result, null, 2), Object.keys(result))
//   for (const [k, v] of Object.entries(result)) {
//   }
//
//   return null
// }
