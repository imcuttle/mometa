import React from '@@__mometa-external/react'
import { css } from '../../../utils/emotion-css'
import { useDragDropManager, useDrop } from '@@__mometa-external/react-dnd'
import { addCss, parseReactDomNode, parseReactDomNodeDeep, setStyle } from '../../../utils/dom-utils'
import { useHeaderStatus, useSelectedNode, useOveringNode } from '@@__mometa-external/shared'
import { OveringFloat } from './floating-ui'
import { MometaHTMLElement, MometaDomApi } from './dom-api'

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
    return Array.from(dom?.children || [])
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
  return isDropableDom(dom) ? <DndDropableNode dom={dom} /> : <DndUndropableNode dom={dom} />
})

function useMometaDomInject(dom: MometaHTMLElement) {
  React.useLayoutEffect(() => {
    // if (dom.classList.contains('ant-tabs-tabpane')) {
    //   console.log('dom', dom, new MometaDomApi(dom).getMometaData())
    // }
    const mometaApi = (dom.__mometa = new MometaDomApi(dom))
    dom.removeAttribute('__mometa')
    dom.dataset.mometaKey = mometaApi.getKey()
    return () => {
      delete dom.dataset.mometaKey
      delete dom.__mometa
    }
  }, [dom])
}

export const DndDropableNode = React.memo(({ dom }: { dom: MometaHTMLElement }) => {
  const [str, drop] = useDrop(
    () => ({
      accept: ['asset'],
      // accept: [Colors.YELLOW, Colors.BLUE],
      drop(_item, monitor) {},
      collect: (monitor) => {
        // dnd 在 window.parent 环境中，当前 useDrog 在 iframe 环境中，使用 collect 返回 object，对比会出现不匹配的情况
        // {}.valueOf !== window.parent.Object.prototype.valueOf
        return JSON.stringify({
          isOverCurrent: monitor.isOver({ shallow: true }),
          isOver: monitor.isOver()
        })
      }
    }),
    [dom]
  )

  const [{ canSelect }] = useHeaderStatus()
  const { isOverCurrent, isOver } = React.useMemo(() => JSON.parse(str), [str])
  // eslint-disable-next-line consistent-return
  React.useLayoutEffect(() => {
    if (isOverCurrent) {
      const style: any = {
        outline: '1px dashed red'
      }
      return setStyle(dom, style)
    }
  }, [isOverCurrent, canSelect, dom])

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

  const [overingNode, setOveringNode] = useOveringNode()
  const [selNode, setSelNode] = useSelectedNode()
  const [isEnter, setIsEnter] = React.useState(false)
  useMometaDomInject(dom)

  // eslint-disable-next-line consistent-return
  React.useEffect(() => {
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
      const dispose = dom.__mometa.preventDefaultPop('click')

      return () => {
        dom.removeEventListener('mouseover', enterHandler)
        dom.removeEventListener('mouseout', leaveHandler)
        dispose()
      }
    }
    setSelNode(null)
    setOveringNode(null)
    setIsEnter(false)
  }, [dom, canSelect, setIsEnter, overingNode, setOveringNode, setSelNode])

  const dropRef = React.useRef<any>()
  dropRef.current = drop
  React.useLayoutEffect(() => {
    dropRef.current(dom)
  }, [dom])

  const isSelected = selNode === dom && !!dom

  return (
    <>
      {(isEnter || isSelected) && !!dom && (
        <OveringFloat onSelect={() => setSelNode(dom)} isSelected={isSelected} dom={dom} />
      )}
      <DndUndropableNode dom={dom} />
    </>
  )
})

export function DndLayout({ dom, children }) {
  const dragDropManager = useDragDropManager()
  React.useLayoutEffect(() => {
    const bk: any = dragDropManager.getBackend()
    bk.addEventListeners(window)
    return () => {
      bk.removeEventListeners(window)
    }
  }, [dragDropManager])

  return (
    <>
      <DndNode dom={dom} />
      {children}
    </>
  )
}
