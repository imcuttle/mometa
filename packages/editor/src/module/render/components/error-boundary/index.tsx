import React from 'react'
import { ErrorBoundary, ErrorBoundaryProps, FallbackProps } from 'react-error-boundary'

import { Alert, Button } from 'antd'

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <Alert
      message={error.message || '发生错误'}
      description={<pre>{error.stack}</pre>}
      type="error"
      showIcon
      action={<Button onClick={resetErrorBoundary}>再试一次</Button>}
    />
  )
}

export type AppErrorBoundaryPropsType = Partial<ErrorBoundaryProps>

const AppErrorBoundary: React.FC<AppErrorBoundaryPropsType> = React.memo(({ children, ...props }) => (
  // @ts-ignore
  <ErrorBoundary FallbackComponent={ErrorFallback} {...props}>
    {children}
  </ErrorBoundary>
))

AppErrorBoundary.defaultProps = {}

export default AppErrorBoundary
