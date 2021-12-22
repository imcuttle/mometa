import { ComponentDoc, parse as newParse, PropItemType, Props } from './parser'

/**
 * This method exists for backward compatibility only.
 * Use *parse* method from *parser* file.
 */
export function parse(fileName: string) {
  return newParse(fileName)
}
