import React from '@@__mometa-external/react'
import { createPortal } from '@@__mometa-external/react-dom'
import c from 'classnames'
import { debounce } from 'lodash-es'
import { getScrollParents } from '@floating-ui/dom'

import { ArrowUpOutlined, ArrowDownOutlined, DragOutlined, DeleteOutlined } from '@ant-design/icons'
import { css } from '../../../utils/emotion-css'
import usePersistFn from '@rcp/use.persistfn'
import { Button, Tooltip } from 'antd'
import { api } from '@@__mometa-external/shared'
import { MometaHTMLElement, useProxyEvents } from './dom-api'
import { PreventFastClick } from '@rcp/c.preventfastop'
import MoreButton from './components/more-button'
import { useDrag } from '@@__mometa-external/react-dnd'

function usePosition(dom: HTMLElement) {
  const [data, setData] = React.useState({ isReady: false, rect: { width: 0, height: 0, x: 0, y: 0 } })
  const [shouldHide, setShouldHide] = React.useState(false)

  React.useEffect(() => {
    if (!dom) {
      return
    }
    const updatePos = () => {
      const rect = dom.getBoundingClientRect()
      setData({ rect, isReady: true })
    }

    updatePos()
    const parents = getScrollParents(dom)

    const reset = debounce(() => {
      setShouldHide(false)
      updatePos()
    }, 500)
    const debouncedUpdate: any = () => {
      setShouldHide(true)
      reset()
    }

    parents.forEach((par) => {
      par.addEventListener('resize', debouncedUpdate)
      par.addEventListener('scroll', debouncedUpdate)
    })

    return () => {
      parents.forEach((par) => {
        par.removeEventListener('resize', debouncedUpdate)
        par.removeEventListener('scroll', debouncedUpdate)
      })
    }
  }, [dom])

  return { shouldHide, ...data }
}

let gDiv
const globalGetContainer = () => {
  if (gDiv && gDiv.parentElement) {
    return gDiv
  }

  if (gDiv) {
    gDiv.remove()
  }

  const div = document.createElement('div')
  Object.assign(div.style, {
    position: 'fixed',
    left: 0,
    top: 0
  })
  document.body.appendChild(div)
  gDiv = div
  return div
}

type FloatingUiProps = JSX.IntrinsicElements['div'] & {
  getContainer?: () => HTMLElement
  dom: MometaHTMLElement
  leftTopElement?: React.ReactNode
  rightTopElement?: React.ReactNode
  centerTopElement?: React.ReactNode
  centerBottomElement?: React.ReactNode
}

export const FloatingUi = React.forwardRef<HTMLDivElement, FloatingUiProps>(function FloatingUi(
  {
    centerBottomElement,
    centerTopElement,
    rightTopElement,
    leftTopElement,
    children,
    dom,
    getContainer = globalGetContainer,
    onClick,
    ...props
  },
  ref
) {
  const { isReady, shouldHide, rect } = usePosition(dom)
  const events = React.useMemo(() => ({ onClick }), [onClick])
  useProxyEvents(dom, events)

  return (
    !!isReady &&
    createPortal(
      <div
        ref={ref}
        style={{
          position: 'absolute',
          left: rect.x,
          top: rect.y,
          width: rect.width,
          minHeight: rect.height,
          display: shouldHide ? 'none' : ''
        }}
        {...props}
      >
        {children}
        {!!leftTopElement && (
          <div
            className={css`
              display: flex;
              transform: translateY(-100%);
              position: absolute;
              top: 0px;
              left: -1px;
            `}
          >
            {leftTopElement}
          </div>
        )}
        {!!rightTopElement && (
          <div
            className={css`
              display: flex;
              transform: translateY(-100%);
              position: absolute;
              top: 0px;
              right: -1px;
            `}
          >
            {rightTopElement}
          </div>
        )}
        {!!centerTopElement && (
          <div
            className={css`
              display: flex;
              transform: translate(-50%, -100%);
              position: absolute;
              top: 0px;
              left: 50%;
              display: flex;
              width: 100%;
              align-items: center;
              justify-content: center;
            `}
          >
            {centerTopElement}
          </div>
        )}
        {!!centerBottomElement && (
          <div
            className={css`
              display: flex;
              transform: translate(-50%, 100%);
              position: absolute;
              bottom: 0px;
              left: 50%;
              display: flex;
              width: 100%;
              align-items: center;
              justify-content: center;
            `}
          >
            {centerBottomElement}
          </div>
        )}
      </div>,
      getContainer()
    )
  )
})

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

type OveringFloatProps = FloatingUiProps & {
  isSelected?: boolean
  onSelect?: () => void
  onDeselect?: () => void
  isOverCurrent?: boolean
}

export const OveringFloat = React.forwardRef<HTMLDivElement, OveringFloatProps>(function OveringFloat(
  { isOverCurrent, isSelected, onDeselect, onSelect, dom, getContainer, ...props },
  ref
) {
  React.useEffect(() => {
    dom.__mometa.preventEvent = false
    return () => {
      if (dom?.__mometa) {
        dom.__mometa.preventEvent = true
      }
    }
  }, [dom])

  const data = dom.__mometa?.getMometaData()

  const [dataStr, drag, preview] = useDrag(
    () => ({
      type: 'dom',
      item: dom,
      end: (item, monitor) => {},
      collect: (monitor) =>
        JSON.stringify({
          isDragging: monitor.isDragging()
        })
    }),
    [dom]
  )

  const { isDragging } = React.useMemo(() => JSON.parse(dataStr), [dataStr])
  // React.useLayoutEffect(() => {
  //   const cls = css`
  //     background-color: #fff !important;
  //   `
  //   if (isDragging && dom) {
  //     dom.classList.add(cls)
  //     return () => {
  //       dom?.classList?.remove(cls)
  //     }
  //   }
  // }, [dom, isDragging])

  const onClickFn = usePersistFn(() => {
    // eslint-disable-next-line no-unused-expressions
    onSelect?.()
  })

  const color = isSelected ? '#5185EC' : '#6F97E7'

  const commonCss = css`
    display: flex;
    color: #fff;
    background-color: ${color};
    padding: 2px 4px;
    font-size: 12px;
    pointer-events: auto;
    border-radius: 3px 3px 0 0;
  `
  const btnCss = css`
    display: inline-flex;
    cursor: pointer;
    margin-left: 2px;
    margin-right: 2px;
    width: 15px !important;
    height: 17px !important;
    line-height: 1 !important;

    &::before {
      background: transparent !important;
    }
    .anticon {
      color: #fff !important;
    }
  `

  const opHandler = usePersistFn(async (opType: string) => {
    return api.handleViewOp(opType, dom)
  })

  if (!dom || !data) {
    return null
  }

  const commonOverCls = css`
    min-height: 25px;
    color: rgb(161, 160, 160);
    font-style: italic;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: rgba(96, 125, 217, 0.3);
    border: 1px dashed rgba(47, 84, 235, 0.8);

    margin-left: -1px;
    margin-right: -1px;
    width: calc(100% + 2px);
  `

  const widthGte = true //rect.width >= rect.height

  const flagElem = (
    <div ref={preview} className={c(commonCss)} title={data.text}>
      {!!data.container && '*'}
      {data.name || 'Unknown'}
    </div>
  )

  return (
    <FloatingUi
      ref={ref}
      leftTopElement={!isDragging && flagElem}
      rightTopElement={
        !isDragging &&
        isSelected &&
        !isOverCurrent && (
          <div className={c(commonCss)}>
            <PreventFastClick onClick={() => opHandler('moving')}>
              <Button
                ref={drag}
                className={c(btnCss)}
                type={'text'}
                size={'small'}
                icon={<DragOutlined />}
                title={'按住并拖动来进行移动；只允许同名文件内移动'}
              />
            </PreventFastClick>
            {!!data.previousSibling && (
              <PreventFastClick onClick={() => opHandler('up')}>
                <Button className={c(btnCss)} type={'text'} size={'small'} title={'上移'} icon={<ArrowUpOutlined />} />
              </PreventFastClick>
            )}
            {!!data.nextSibling && (
              <PreventFastClick onClick={() => opHandler('down')}>
                <Button
                  className={c(btnCss)}
                  type={'text'}
                  size={'small'}
                  title={'下移'}
                  icon={<ArrowDownOutlined />}
                />
              </PreventFastClick>
            )}
            <PreventFastClick onClick={() => opHandler('del')}>
              <Button
                className={c(btnCss)}
                type={'text'}
                size={'small'}
                title={'删除'}
                icon={<DeleteOutlined title={'删除'} />}
              />
            </PreventFastClick>
            <MoreButton className={btnCss} dom={dom} />
          </div>
        )
      }
      dom={dom}
      getContainer={getContainer}
      className={c(
        css`
        pointer-events: none; !important;
        display: flex;
        flex-direction: ${widthGte ? 'row' : 'column'};
      `,
        isDragging &&
          css`
            background-color: rgba(96, 125, 217, 0.3);
          `,
        !isOverCurrent && css`outline: ${isSelected ? '1px solid ' + color : '1px dashed ' + color}; !important;`
      )}
      onClick={onClickFn}
    >
      {!!isOverCurrent && (
        <>
          <div
            data-pos={'up'}
            className={c(
              commonOverCls,
              css`
                background-color: rgba(95, 217, 129, 0.3);
                flex: 2;
              `
            )}
          >
            放置在上
          </div>
          {!data.selfClosed && (
            <div
              data-pos={'child'}
              className={c(
                commonOverCls,
                css`
                  flex: 3;
                `,
                widthGte
                  ? css`
                      border-left: none !important;
                      border-right: none !important;
                    `
                  : css`
                      border-top: none !important;
                      border-bottom: none !important;
                    `
              )}
            >
              放置在这
            </div>
          )}
          <div
            data-pos={'down'}
            className={c(
              commonOverCls,
              css`
                background-color: rgba(89, 214, 219, 0.3);
                flex: 2;
              `
            )}
          >
            放置在下
          </div>
        </>
      )}
    </FloatingUi>
  )
})
