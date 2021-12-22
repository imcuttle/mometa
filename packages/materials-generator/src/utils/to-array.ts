export function toArray(v: any) {
  if (Array.isArray(v)) {
    return v
  }
  if (v == null) {
    return v
  }
  return [v]
}

export function flatten(v: any[]) {
  const newArr = []
  toArray(v).forEach((x) => {
    if (Array.isArray(x)) {
      newArr.push(...flatten(x))
    } else {
      newArr.push(x)
    }
  })
  return newArr
}
