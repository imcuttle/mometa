import * as React from 'react'

interface Coords {
  x: number
  y: number
}

export interface Props extends React.HTMLAttributes<Element> {
  /**
   * originX description
   */
  originX: number
  /**
   * originY description
   */
  originY: number
  /** scaleFactor description */
  scaleFactor: number
  /** Maximum zoom level */
  maxScale?: number
  /** Minimum zoom level */
  minScale?: number
  /**
   * The zoom change handler for controlled components.
   * It should update the other props in order to reflect the zoom change.
   */
  onZoom(scale: number, translateX: number, translateY: number): void
}

type Matrix = string

interface State {
  matrix: Matrix
  canZoomIn: boolean
  canZoomOut: boolean
}

function getCanZoomIn({ maxScale = Infinity, scaleFactor }: Props): boolean {
  return scaleFactor < maxScale
}

function getCanZoomOut({ minScale = Infinity, scaleFactor }: Props): boolean {
  return scaleFactor > minScale
}

/**
 * Zoomable description
 */
export class Zoomable extends React.PureComponent<Props, State> {
  public render() {
    const { style, className, children, scaleFactor, onZoom, minScale, maxScale, originX, originY, ...rest } =
      this.props
    const { canZoomIn, canZoomOut } = this.state

    return <div />
  }
}
