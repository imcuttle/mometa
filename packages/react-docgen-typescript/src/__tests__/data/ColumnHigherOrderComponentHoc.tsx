import * as React from 'react'

export function externalHoc<T>(C: T): T {
  return ((props) => <div>{C}</div>) as any as T
}
