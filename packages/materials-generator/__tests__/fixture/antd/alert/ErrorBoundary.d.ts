import * as React from 'react'
interface ErrorBoundaryProps {
  message?: React.ReactNode
  description?: React.ReactNode
}
export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  {
    error?: Error | null
    info: {
      componentStack?: string
    }
  }
> {
  state: {
    error: undefined
    info: {
      componentStack: string
    }
  }
  componentDidCatch(error: Error | null, info: object): void
  render(): React.ReactNode
}
export {}
