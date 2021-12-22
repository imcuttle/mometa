import * as React from 'react'
import ErrorBoundary from './ErrorBoundary'
export interface AlertProps {
  /** Type of Alert styles, options:`success`, `info`, `warning`, `error` */
  type?: 'success' | 'info' | 'warning' | 'error'
  /** Whether Alert can be closed */
  closable?: boolean
  /** Close text to show */
  closeText?: React.ReactNode
  /** Content of Alert */
  message?: React.ReactNode
  /** Additional content of Alert */
  description?: React.ReactNode
  /** Callback when close Alert */
  onClose?: React.MouseEventHandler<HTMLButtonElement>
  /** Trigger when animation ending of Alert */
  afterClose?: () => void
  /** Whether to show icon */
  showIcon?: boolean
  /** https://www.w3.org/TR/2014/REC-html5-20141028/dom.html#aria-role-attribute */
  role?: string
  style?: React.CSSProperties
  prefixCls?: string
  className?: string
  banner?: boolean
  icon?: React.ReactNode
  action?: React.ReactNode
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>
  onClick?: React.MouseEventHandler<HTMLDivElement>
}
interface AlertInterface extends React.FC<AlertProps> {
  ErrorBoundary: typeof ErrorBoundary
}
declare const Alert: AlertInterface
export const AlertComp: AlertInterface
export const data: {
  abc: string
}
export default Alert
