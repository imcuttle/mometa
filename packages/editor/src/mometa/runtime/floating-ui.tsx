import React from 'react'
import c from 'classnames'
import { debounce, omit, pick } from 'lodash-es'
import { getScrollParents } from '@floating-ui/dom'

import { ArrowUpOutlined, ArrowDownOutlined, DragOutlined, DeleteOutlined } from '@ant-design/icons'
import { css } from '../utils/emotion-css'
import usePersistFn from '@rcp/use.persistfn'
import { Button, Menu, Tooltip } from 'antd'
import { MometaHTMLElement, useProxyEvents } from './dom-api'
import { PreventFastClick } from '@rcp/c.preventfastop'
import MoreButton from './components/more-button'
import { useDrag } from 'react-dnd'
import { getSharedFromMain } from '../utils/get-from-main'
const { api } = getSharedFromMain()

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

type FloatingUiProps = JSX.IntrinsicElements['div'] & {
  dom: MometaHTMLElement
  leftTopElement?: React.ReactNode
  rightTopElement?: React.ReactNode
  rightBottomElement?: React.ReactNode
  centerTopElement?: React.ReactNode
  centerBottomElement?: React.ReactNode
}

export const FloatingUi = React.forwardRef<HTMLDivElement, FloatingUiProps>(function FloatingUi(
  {
    centerBottomElement,
    centerTopElement,
    rightTopElement,
    rightBottomElement,
    leftTopElement,
    children,
    dom,
    ...props
  },
  ref
) {
  const { isReady, shouldHide, rect } = usePosition(dom)

  const handlerKeys = React.useMemo(() => {
    return Object.keys(props).filter((n) => /^on[A-Z]/.test(n))
  }, [props])
  const events = React.useMemo(() => pick(props, handlerKeys), [handlerKeys, props])
  useProxyEvents(dom, events)

  return (
    !!isReady && (
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
        {...omit(props, handlerKeys)}
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
        {!!rightBottomElement && (
          <div
            className={css`
              display: flex;
              transform: translateY(100%);
              position: absolute;
              bottom: 0;
              right: -1px;
            `}
          >
            {rightBottomElement}
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
      </div>
    )
  )
})

type OveringFloatProps = FloatingUiProps & {
  isSelected?: boolean
  onSelect?: () => void
  onDeselect?: () => void
  isOverCurrent?: boolean
}

export const OveringFloat = React.forwardRef<HTMLDivElement, OveringFloatProps>(function OveringFloat(
  { isOverCurrent, isSelected, onDeselect, onSelect, dom, ...props },
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

  const onClickFn = usePersistFn((evt) => {
    // eslint-disable-next-line no-unused-expressions
    onSelect?.()
  })

  const color = isSelected ? '#5185EC' : '#6F97E7'

  const commonCss = css`
    display: flex;
    align-items: center;
    color: #fff;
    background-color: ${color};
    height: 21px;
    padding: 0 4px;
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
  const { rect } = usePosition(dom)

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
  const widthSm = rect.width <= 120

  const flagElem = (
    <div ref={preview} className={c(commonCss)} title={data.text}>
      {!!data.container && '*'}
      {data.name || 'Unknown'}
    </div>
  )

  const opElement = (
    <>
      {!!data.previousSibling && (
        <Tooltip title={'上移'}>
          {/*// @ts-ignore*/}
          <PreventFastClick className={c(btnCss)} onClick={() => opHandler('up')}>
            <Button type={'text'} size={'small'} icon={<ArrowUpOutlined />} />
          </PreventFastClick>
        </Tooltip>
      )}
      {!!data.nextSibling && (
        <Tooltip title={'下移'}>
          {/*// @ts-ignore*/}
          <PreventFastClick className={c(btnCss)} onClick={() => opHandler('down')}>
            <Button type={'text'} size={'small'} icon={<ArrowDownOutlined />} />
          </PreventFastClick>
        </Tooltip>
      )}
      <Tooltip title={'删除'}>
        {/*// @ts-ignore*/}
        <PreventFastClick className={c(btnCss)} onClick={() => opHandler('del')}>
          <Button type={'text'} size={'small'} icon={<DeleteOutlined title={'删除'} />} />
        </PreventFastClick>
      </Tooltip>
    </>
  )

  const dragElem = (
    <Tooltip title={'按住并拖动来进行移动；暂时只允许同名文件内移动'}>
      {/*// @ts-ignore*/}
      <PreventFastClick className={c(btnCss)} onClick={() => opHandler('moving')}>
        <Button ref={drag} type={'text'} size={'small'} icon={<DragOutlined />} title={''} />
      </PreventFastClick>
    </Tooltip>
  )

  const isSimple = rect.width < 230
  const shouldShowOp = !isDragging && isSelected && !isOverCurrent

  return (
    <FloatingUi
      ref={ref}
      leftTopElement={!isDragging && flagElem}
      rightBottomElement={
        isSimple &&
        shouldShowOp && (
          <div
            className={c(
              commonCss,
              css`
                border-radius: 0 0 3px 3px;
              `
            )}
          >
            {dragElem}
            <MoreButton
              className={btnCss}
              dom={dom}
              menu={
                <>
                  {!!data.previousSibling && <Menu.Item onClick={() => opHandler('up')}>上移</Menu.Item>}
                  {!!data.nextSibling && <Menu.Item onClick={() => opHandler('down')}>下移</Menu.Item>}
                  <Menu.Item danger onClick={() => opHandler('del')}>
                    删除
                  </Menu.Item>
                </>
              }
            />
          </div>
        )
      }
      rightTopElement={
        !isSimple &&
        shouldShowOp && (
          <div className={c(commonCss)}>
            {dragElem}
            {opElement}
            <MoreButton className={btnCss} dom={dom} />
          </div>
        )
      }
      dom={dom}
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
            {widthSm ? '' : '放置在上'}
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
              {widthSm ? '' : '放置在这'}
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
            {widthSm ? '' : '放置在下'}
          </div>
        </>
      )}
    </FloatingUi>
  )
})
