import React, { Ref, RefObject } from 'react'
import p from 'prefix-classname'
import { Button, Input } from 'antd'
import { ArrowLeftOutlined, ArrowRightOutlined, ReloadOutlined } from '@ant-design/icons'
import { CLS_PREFIX, useLocationAction } from '../../../config/const'

import './style.scss'

const cn = p('')
const c = p(`${CLS_PREFIX}-location-widget`)

export interface LocationWidgetProps {
  className?: string
  iframeRef: RefObject<HTMLIFrameElement>
}

const useForceUpdate = () => {
  const [v, setV] = React.useState(0)
  const update = React.useCallback(() => {
    setV((x) => x + 1)
  }, [setV])

  return [update, v] as any
}

const LocationWidget: React.FC<LocationWidgetProps> = React.memo(({ className, iframeRef }) => {
  const [action, setLocationAction] = useLocationAction()
  const [update] = useForceUpdate()
  const historyRef = React.useRef<{ index: number; urls: string[] }>({ urls: [], index: -1 })
  React.useMemo(() => {
    if (action) {
      if (action.action === 'PUSH' || historyRef.current.index < 0) {
        const i = historyRef.current.urls.indexOf(action.url)
        if (i >= 0) {
          historyRef.current.urls.splice(i, 1)
        }

        historyRef.current.urls.push(action.url)
        historyRef.current.index = historyRef.current.urls.length - 1
      } else {
        const i = historyRef.current.urls.indexOf(action.url)

        historyRef.current.urls[historyRef.current.index] = action.url
        if (i > historyRef.current.index) {
          historyRef.current.urls.splice(i, 1)
        } else if (i >= 0 && i < historyRef.current.index) {
          historyRef.current.urls.splice(i, 1)
          historyRef.current.index--
        }
      }
    }
  }, [action])

  const reload = () => {
    iframeRef.current.contentWindow.location.reload()
  }
  const reloadAndReset = () => {
    historyRef.current = {
      urls: [url()],
      index: 0
    }
    reload()
    update()
  }
  const url = () => {
    return historyRef.current.urls[historyRef.current.index]
  }
  const canBack = () => {
    if (historyRef.current.index <= 0) {
      return false
    }
    return !!historyRef.current.urls.slice(0, historyRef.current.index).length
  }
  const canForward = () => {
    if (historyRef.current.index < 0) {
      return false
    }
    return historyRef.current.index < historyRef.current.urls.length - 1
  }

  const back = () => {
    if (canBack()) {
      historyRef.current.index = historyRef.current.index - 1
      setLocationAction({ action: 'REPLACE', url: historyRef.current.urls[historyRef.current.index] })
    }
  }
  const forward = () => {
    if (canForward()) {
      historyRef.current.index = historyRef.current.index + 1
      setLocationAction({ action: 'REPLACE', url: historyRef.current.urls[historyRef.current.index] })
    }
  }

  const [inputValue, setInputValue] = React.useState(url())
  React.useLayoutEffect(() => {
    setInputValue(url())
  }, [url()])

  return (
    <div className={cn(c(), className)}>
      <div className={c('__btns')}>
        <Button
          title={'后退'}
          type={'text'}
          shape={'circle'}
          disabled={!canBack()}
          onClick={back}
          icon={<ArrowLeftOutlined />}
        />
        <Button
          title={'前进'}
          type={'text'}
          shape={'circle'}
          disabled={!canForward()}
          onClick={forward}
          icon={<ArrowRightOutlined />}
        />
        <Button title={'刷新'} type={'text'} shape={'circle'} onClick={reloadAndReset} icon={<ReloadOutlined />} />
      </div>
      <div className={c('__url')}>
        <Input
          bordered={false}
          className={c('__input')}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={(evt: any) => {
            const newUrl = evt.target.value.trim()
            if (url() === newUrl) {
              reload()
            } else {
              setLocationAction({ action: 'PUSH', url: newUrl })
            }
          }}
        />
      </div>
    </div>
  )
})

LocationWidget.defaultProps = {}

export default LocationWidget
