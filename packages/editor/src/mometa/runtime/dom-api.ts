import { EventEmitter } from 'events'
import React from 'react'
import getWindow from 'get-window'
import { getLatestFiber, parseReactDomNodeDeep, ReactFiber } from '../utils/dom-utils'

const findClosest = <T extends HTMLElement>(
  from: T,
  isPass: (v: T) => boolean
  // eslint-disable-next-line consistent-return
) => {
  let t = from
  while (t) {
    if (isPass(t)) {
      return t
    }
    t = t.parentElement as any
  }
}

const findClosestFiber = <T extends ReactFiber = ReactFiber>(
  from: T,
  isPass: (v: T) => boolean | T
  // eslint-disable-next-line consistent-return
) => {
  let t = from
  while (t) {
    const res = isPass(t)
    if (res === true) {
      return t
    }
    if (res) {
      t = res
    }
    t = t.return as any
  }
}

export class MometaDomApi extends EventEmitter {
  constructor(public dom: HTMLElement) {
    super()
  }

  public selectedKey: string = null

  protected _preventDefault = (evt) => {
    // React SyntheticEvent
    // if (evt.nativeEvent) {
    //   return
    // }

    const closestPass = findClosest(evt.target, (x) => x.__mometa && !x.__mometa.preventEvent)
    if (closestPass) {
      closestPass.__mometa.emit(evt.type, evt)
    }
    evt.stopPropagation()
    evt.preventDefault()
  }

  public preventEvent = true

  public preventDefaultPop(event: string, options?: boolean | AddEventListenerOptions) {
    this.dom.addEventListener(event, this._preventDefault, options)
    return () => {
      this.dom.removeEventListener(event, this._preventDefault, options)
    }
  }

  public getMometaList() {
    const parents = new Set()
    const data = parseReactDomNodeDeep(this.dom)
    if (data?.fiber) {
      findClosestFiber(data.fiber, (f) => {
        f = getLatestFiber(f)
        while (f && !f._debugSource?.__mometa) {
          f = getLatestFiber(f.return)
        }
        let t = f
        while (t && !(t.stateNode instanceof getWindow(this.dom).HTMLElement)) {
          t = t.child
        }
        if (t) {
          // if (t.stateNode !== this.dom) {
          //   return true
          // }
          parents.add(getLatestFiber(f)._debugSource?.__mometa)
        }
        return f
      })
    }
    return Array.from(parents.values()) as any[]
  }

  public getMometaData(): MometaData {
    const list = this.getMometaList()
    return list.find((x) => x.hash === this.selectedKey) ?? list[0]
  }

  public getKey() {
    return this.getMometaData()?.hash
  }

  findParents() {
    const parents = []
    const data = parseReactDomNodeDeep(this.dom)
    if (data?.fiber) {
      findClosestFiber(data.fiber, (f) => {
        f = getLatestFiber(f)
        while (f && !f._debugSource?.__mometa) {
          f = getLatestFiber(f.return)
        }
        let t = f
        while (t && !(t.stateNode instanceof getWindow(this.dom).HTMLElement)) {
          t = t.child
        }
        if (t) {
          parents.push({
            dom: t.stateNode,
            mometa: getLatestFiber(f)._debugSource?.__mometa
          })
        }
        return f
      })
    }

    return parents
  }
}

export type MometaHTMLElement<T extends HTMLElement = HTMLElement> = T & {
  __mometa: MometaDomApi
}

/**
 * 为了不修改原有 dom 事件，使用自定义的发布订阅模拟实现 dom 事件
 * @param dom
 * @param events
 */
export function useProxyEvents(dom: MometaHTMLElement, events: Pick<JSX.IntrinsicElements['div'], 'onClick'>) {
  React.useEffect(() => {
    if (!events) {
      return () => {}
    }

    const disposes = []
    for (const [name, fn] of Object.entries(events)) {
      let tName = name.toLowerCase()
      tName = tName.replace(/^on/, '').replace(/capture$/, '')

      dom.__mometa.addListener(tName, fn)
      disposes.push(() => {
        dom.__mometa?.removeListener(tName, fn)
      })
    }
    return () => {
      disposes.forEach((fn) => fn())
    }
  }, [dom, events])
}
