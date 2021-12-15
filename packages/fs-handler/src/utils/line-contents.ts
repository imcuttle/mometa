import { resolveConfig } from 'prettier'
import { format } from 'prettier/standalone'
import parserBabel from 'prettier/parser-babel'
import parserTs from 'prettier/parser-typescript'

const config = resolveConfig && resolveConfig?.sync?.(process.cwd())

export class Line {
  constructor(public content: string | symbol) {}

  static create(line: string) {
    return new Line(line)
  }

  slice(start?: number, end?: number) {
    // @ts-ignore
    return new Line(this.content.slice(start, end))
  }

  toString() {
    return this.content
  }
}

interface ContentParserOptions {
  filename?: string
}

export interface Point {
  line: number
  column: number
}

export interface Range {
  start: Point
  end: Point
}

export const EMPTY = Symbol.for('EMPTY')

export class LineContents {
  constructor(public contents: Line[], public options: ContentParserOptions = {}) {}
  assertPoint(p: Point) {
    if (p.line < 0) {
      throw new Error(`Point is invalid. ${JSON.stringify(p)}`)
    }
  }
  assertRange(r: Range) {
    this.assertPoint(r.start)
    this.assertPoint(r.end)
  }

  locateLineByPos(lineNum: number): Line | undefined {
    return this.contents[lineNum - 1]
  }

  locateByRange(range: Range) {
    this.assertRange(range)

    const contents: Array<{
      line: Line
      lineNumber: number
      start: number
      end?: number
    }> = []
    let lineNo = range.start.line
    while (lineNo <= range.end.line) {
      let end: number
      let start: number = 0
      if (lineNo === range.start.line) {
        start = range.start.column
      }
      if (lineNo === range.end.line) {
        end = range.end.column
      }

      contents.push({
        lineNumber: lineNo,
        start,
        end,
        line: this.locateLineByPos(lineNo).slice(start, end)
      })
      lineNo++
    }
    return contents
  }

  toString(normalize = true) {
    const content = this.contents
      .filter((x) => x.content !== EMPTY)
      .map((x) => x.toString())
      .join('\n')
    if (!normalize) {
      return content
    }

    const name = this.options.filename || 'index.js'
    const isTs = /\.tsx?$/.test(name)

    try {
      return format(content, {
        ...config,
        filepath: this.options.filename,
        parser: isTs ? 'typescript' : 'babel',
        plugins: [isTs ? parserTs : parserBabel]
      })
        .replace(/^;/, '')
        .trim()
    } catch (err) {
      err.message = `${content}

${err.message}`
      throw err
    }
  }
}

export function createLineContentsByContent(content: string, options?: ContentParserOptions) {
  return new LineContents(
    content.split('\n').map((line) => Line.create(line)),
    options
  )
}
