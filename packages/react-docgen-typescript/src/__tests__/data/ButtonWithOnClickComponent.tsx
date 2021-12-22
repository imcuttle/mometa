import { FC, PropsWithRef } from 'react'

type HTMLButtonProps = JSX.IntrinsicElements['button']

type Props = HTMLButtonProps & {
  /** onClick event handler */
  onClick?: HTMLButtonProps['onClick']
}

const ButtonWithOnClickComponent: FC<Props> = (props) => {
  return <button {...props} />
}

export default ButtonWithOnClickComponent
