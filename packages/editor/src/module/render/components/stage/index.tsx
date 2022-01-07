import React, { IframeHTMLAttributes } from 'react'
import p from 'prefix-classname'
import { useDragDropManager } from 'react-dnd'
import { Spin } from 'antd'
import {
  CLS_PREFIX,
  overingNodeSubject,
  selectedNodeSubject,
  useLocationAction,
  locationActionSubject,
  iframeWindowsSubject,
  useIframeWindows
} from '../../../config/const'
import { addModules } from '../../utils/externals-modules'
import { useSharedMap, useSharedUpdateMap, SharedProvider, useShared, useSharedProvider } from '@rcp/use.shared'

const cn = p('')
const c = p(`${CLS_PREFIX}-stage`)

import './style.scss'

import { headerStatusSubject, useHeaderStatus } from '../header'
import { register, addRemoteGlobalThis, removeRemoteGlobalThis, setId } from '../../../../shared/pipe'
import LocationWidget from '../location-widget'

setId(`main`)

export interface StageProps {
  className?: string
  bundlerURL?: string
  externalModules?: Record<string, any>
}

const DndManager = React.lazy(() => import('../../../render-floating').then((x) => ({ default: x.DndLayoutManager })))

const StageContent: React.FC<StageProps> = React.memo(({ className, externalModules, bundlerURL }) => {
  React.useLayoutEffect(() => {
    if (externalModules) {
      return addModules(externalModules)
    }
  }, [externalModules])
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  React.useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      addRemoteGlobalThis(iframeRef.current.contentWindow)
      return () => {
        removeRemoteGlobalThis(iframeRef.current?.contentWindow)
      }
    }
  }, [iframeRef])

  const [action, setAction] = useLocationAction()
  React.useLayoutEffect(() => {
    setAction({ action: 'PUSH', url: bundlerURL, outer: true })
  }, [bundlerURL])

  const [iframeSrc, setIframeSrc] = React.useState(bundlerURL)
  React.useLayoutEffect(() => {
    if (!action) {
      return
    }
    if (action.url.includes('#')) {
      setIframeSrc(action.url)
      return
    }
    if (action.outer) {
      setIframeSrc(action.url)
    }
  }, [action])

  const [{ showLocation }] = useHeaderStatus()
  const [api] = useShared('api')
  const ddManager = useDragDropManager()
  const _sharedMap = useSharedMap()
  const _sharedUpdateMap = useSharedUpdateMap()
  React.useLayoutEffect(
    () =>
      register('shared', {
        api,
        iframeWindowsSubject,
        overingNodeSubject,
        selectedNodeSubject,
        headerStatusSubject,
        locationActionSubject,
        ddManager,
        _sharedMap,
        _sharedUpdateMap
      }),
    [ddManager, _sharedMap, _sharedUpdateMap, api]
  )

  return (
    <div className={cn(c(), className)}>
      {!!showLocation && <LocationWidget iframeRef={iframeRef} />}
      <div
        style={{
          backgroundColor: '#e2e5ec',
          flex: 1,
          display: 'flex'
        }}
      >
        <div className={c('__iframe-wrapper')}>
          <div className={c('__iframe-mask')}>
            <Spin style={{ flex: 1 }} tip={'渲染中...'} />
          </div>
          <iframe ref={iframeRef} src={iframeSrc} className={c('__iframe')} />
          <div className={c('__iframe-floating-container')}>
            <DndManager />
          </div>
        </div>
      </div>
    </div>
  )
})

const Stage = (props) => {
  return (
    <React.Suspense fallback={<Spin className={c('__spin')} tip={'加载中...'} />}>
      <StageContent {...props} />
    </React.Suspense>
  )
}

Stage.defaultProps = {
  bundlerURL: '/bundler.html'
}

export default Stage
