import * as React from 'react'

/** Props comment */
export type Props = React.HTMLAttributes<HTMLImageElement> & {
  /** isFlippedX description */
  isFlippedX?: boolean
  /** isFlippedY description */
  isFlippedY?: boolean
}

/** FlippableImage description */
export const FlippableImage = (props: Props) => {
  const { src, isFlippedX = false, isFlippedY = false, style, ...rest } = props

  let transform = ''
  if (isFlippedX) {
    transform += ` scale(-1, 1)`
  }
  if (isFlippedY) {
    transform += ` scale(1, -1)`
  }

  return <img src={src || undefined} style={{ ...style, transform }} {...rest} />
}
