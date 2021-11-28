import { useRef } from 'react'

export default function usePersistRef<T>(value: T) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const ref = useRef<T>(value)
  ref.current = value

  return ref
}
