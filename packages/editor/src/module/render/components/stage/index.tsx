import React, { IframeHTMLAttributes } from 'react'
import p from 'prefix-classname'
import { useDragDropManager } from 'react-dnd'
import {
  CLS_PREFIX,
  overingNodeSubject,
  selectedNodeSubject,
  useLocationAction,
  locationActionSubject
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

const StageContent: React.FC<StageProps> = React.memo(({ className, externalModules, bundlerURL }) => {
  React.useLayoutEffect(() => !!externalModules && addModules(externalModules), [externalModules])
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
      <iframe ref={iframeRef} src={iframeSrc} className={c('__iframe')} />
    </div>
  )
})

const Stage = (props) => {
  return <StageContent {...props} />
}

Stage.defaultProps = {
  bundlerURL: '/bundler.html'
}

export default Stage
