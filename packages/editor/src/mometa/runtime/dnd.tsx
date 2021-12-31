import React from 'react'
import { css } from '../utils/emotion-css'
import { useDrop } from 'react-dnd'
import { addCss, parseReactDomNodeDeep } from '../utils/dom-utils'
import { OveringFloat } from './floating-ui'
import { MometaHTMLElement, MometaDomApi } from './dom-api'
import { Provider } from './provider'
import { getSharedFromMain, useOveringNode, useHeaderStatus, useSelectedNode } from '../utils/get-from-main'
const { api } = getSharedFromMain()

function isDropableDom(dom: HTMLElement) {
  if (dom.localName === EMPTY_PLACEHOLDER_NAME) {
    return false
  }
  const res = parseReactDomNodeDeep(dom)
  // return !!res?.mometa
  // 寻找第一个 fiber 节点 (stateNode === dom)
  let f = res?.fiber
  while (f && f.stateNode !== dom) {
    f = f.child
  }
  return !!f
}

const EMPTY_PLACEHOLDER_NAME = 'mometa-empty-placeholder'

function useDfsDom(dom: HTMLElement) {
  const [domChildren, setDomChildren] = React.useState([])
  const domChildrenRef = React.useRef<any[]>()
  domChildrenRef.current = domChildren

  const getDomChildren = React.useCallback(() => {
    if (dom?.parentElement) {
      return Array.from(dom?.children || [])
    }
    return []
  }, [dom])

  React.useLayoutEffect(() => {
    if (!dom) {
      setDomChildren(getDomChildren())
      return
    }
    const ob = new MutationObserver((records) => {
      const newChildren = domChildrenRef.current.slice()
      let isUpdate = false
      for (const record of records) {
        if (record.removedNodes) {
          // eslint-disable-next-line no-loop-func
          record.removedNodes.forEach((item) => {
            const i = newChildren.indexOf(item)
            if (i >= 0) {
              isUpdate = true
              newChildren.splice(i, 1)
            }
          })
        }
        if (record.addedNodes) {
          // eslint-disable-next-line no-loop-func
          record.addedNodes.forEach((item) => {
            const i = newChildren.indexOf(item)
            if (i < 0) {
              isUpdate = true
              newChildren.push(item)
            }
          })
        }
      }

      if (isUpdate) {
        setDomChildren(newChildren)
      }
    })
    ob.observe(dom, {
      subtree: false,
      attributes: false,
      childList: true
    })

    setDomChildren(getDomChildren())
    return () => {
      ob.disconnect()
    }
  }, [dom, getDomChildren])

  return [domChildren]
}

export const DndUndropableNode = React.memo(({ dom }: { dom: HTMLElement }) => {
  const [domChildren] = useDfsDom(dom)

  if (!dom?.parentElement) {
    return null
  }

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {domChildren?.map((child, key) => (
        // eslint-disable-next-line react/no-array-index-key
        <DndNode key={key} dom={child} />
      ))}
    </>
  )
})

const DndNode = React.memo(function ({ dom }: any) {
  if (dom && dom.parentElement) {
    return isDropableDom(dom) ? <DndDropableNode dom={dom} /> : <DndUndropableNode dom={dom} />
  }
  return null
})

function useMometaDomInject(dom: MometaHTMLElement) {
  React.useLayoutEffect(() => {
    if (!dom) {
      return
    }
    const mometaApi = (dom.__mometa = new MometaDomApi(dom))
    dom.removeAttribute?.('__mometa')
    if (dom.dataset) {
      dom.dataset.mometaKey = mometaApi.getKey()
    }
    return () => {
      delete dom.dataset?.mometaKey
      delete dom.__mometa
    }
  }, [dom])
}

export const DndDropableNode = React.memo(({ dom }: { dom: MometaHTMLElement }) => {
  const [overingNode, setOveringNode] = useOveringNode()
  const [selNode, setSelNode] = useSelectedNode()
  const isSelected = selNode === dom && !!dom

  const overingUiRef = React.useRef(null)
  const [str, drop] = useDrop(
    () => ({
      accept: ['asset', 'dom'],
      drop(item: any, monitor) {
        if (monitor.isOver({ shallow: true }) && overingUiRef.current) {
          const clientOffset = monitor.getClientOffset()
          const children: HTMLElement[] = overingUiRef.current.children
          const matchedDom = Array.from(children).find((dom: HTMLElement) => {
            const rect = dom.getBoundingClientRect()
            if (
              clientOffset.x >= rect.x &&
              clientOffset.x <= rect.x + rect.width &&
              clientOffset.y >= rect.y &&
              clientOffset.y <= rect.y + rect.height
            ) {
              return true
            }
          })
          const itemType = monitor.getItemType()
          console.log('itemType', { itemType, item, pos: matchedDom?.dataset?.pos })
          if (matchedDom?.dataset?.pos) {
            if (itemType === 'asset') {
              return api.handleViewOp('insert-asset', dom, {
                asset: item.data,
                direction: matchedDom?.dataset?.pos
              })
            } else if (itemType === 'dom') {
              return api.handleViewOp('move-dom', item, {
                toDom: dom,
                direction: matchedDom?.dataset?.pos
              })
            }
          }
        }
      },
      collect: (monitor) => {
        const itemType = monitor.getItemType()
        const item = monitor.getItem() as any

        let isOverCurrent = false
        if (itemType !== 'dom') {
          isOverCurrent = monitor.isOver({ shallow: true })
        } else {
          // dom 下只能允许同名文件内移动 & 不同 dom
          isOverCurrent =
            item !== dom &&
            monitor.isOver({ shallow: true }) &&
            !!item?.__mometa &&
            item.__mometa.getMometaData().filename === dom.__mometa.getMometaData().filename
        }

        // dnd 在 window.parent 环境中，当前 useDrog 在 iframe 环境中，使用 collect 返回 object，对比会出现不匹配的情况
        // {}.valueOf !== window.parent.Object.prototype.valueOf
        return JSON.stringify({
          isOverCurrent,
          isOver: monitor.isOver()
        })
      }
    }),
    [dom, isSelected]
  )

  const [{ canSelect }] = useHeaderStatus()
  const { isOverCurrent, isOver } = React.useMemo(() => JSON.parse(str), [str])
  // eslint-disable-next-line consistent-return
  React.useLayoutEffect(() => {
    if (isOver) {
      return addCss(
        dom,
        css`
          ${EMPTY_PLACEHOLDER_NAME} {
            display: block !important;
          }
        `
      )
    }
  }, [isOver, dom])

  const [isEnter, setIsEnter] = React.useState(false)
  useMometaDomInject(dom)

  // eslint-disable-next-line consistent-return
  React.useEffect(() => {
    if (!dom || !dom.__mometa) {
      return
    }
    if (canSelect) {
      setIsEnter(overingNode === dom)
      const enterHandler = (evt) => {
        setOveringNode(dom)
        evt.stopPropagation()
      }
      const leaveHandler = (evt) => {
        if (dom === overingNode) {
          setOveringNode(null)
          evt.stopPropagation()
        }
      }
      dom.addEventListener('mouseover', enterHandler)
      dom.addEventListener('mouseout', leaveHandler)
      const disposes = [
        dom.__mometa.preventDefaultPop('click', true),
        dom.__mometa.preventDefaultPop('mousedown', true),
        dom.__mometa.preventDefaultPop('beforeinput', true)
      ]

      return () => {
        dom.removeEventListener('mouseover', enterHandler)
        dom.removeEventListener('mouseout', leaveHandler)
        disposes.forEach((fn) => fn())
      }
    }
    setSelNode(null)
    setOveringNode(null)
    setIsEnter(false)
  }, [dom, canSelect, setIsEnter, overingNode, setOveringNode, setSelNode])

  const dropRef = React.useRef<any>()
  dropRef.current = drop
  React.useLayoutEffect(() => {
    if (!dom) {
      return
    }
    dropRef.current(dom)
  }, [dom])

  if (!dom?.parentElement) {
    return null
  }

  return (
    <>
      {(isEnter || isSelected || isOverCurrent) && !!dom && (
        <OveringFloat
          ref={overingUiRef}
          isOverCurrent={isOverCurrent}
          onSelect={() => setSelNode(dom)}
          isSelected={isSelected}
          dom={dom}
        />
      )}
      {!!dom && <DndUndropableNode dom={dom} />}
    </>
  )
})

export function DndLayout({ dom }) {
  return (
    <Provider>
      <DndNode dom={dom} />
    </Provider>
  )
}
