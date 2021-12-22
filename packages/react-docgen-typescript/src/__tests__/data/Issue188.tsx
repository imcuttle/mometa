import * as React from 'react'

interface Props {
  content: string
}

export const Header = ({ content }: Props) => {
  return <h1>{content}</h1>
}
