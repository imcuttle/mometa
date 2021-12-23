import { Point } from './line-contents'

export function comparePoint(p1: Point, p2: Point): 1 | 0 | -1 {
  if (p1.line > p2.line) {
    return 1
  }
  if (p1.line < p2.line) {
    return -1
  }

  if (p1.column > p2.column) {
    return 1
  }
  if (p1.column < p2.column) {
    return -1
  }
  return 0
}
