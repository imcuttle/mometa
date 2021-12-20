export function toArray(v: any) {
  if (Array.isArray(v)) {
    return v
  }
  if (v == null) {
    return v
  }
  return [v]
}
