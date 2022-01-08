import React, { IframeHTMLAttributes } from 'react'
import p from 'prefix-classname'
import { useDragDropManager } from 'react-dnd'
import { Spin } from 'antd'
import { useLocalStorageStateSync } from '@rcp/use.syncstorage/dist/es/src/storage'
import {
  CLS_PREFIX,
  overingNodeSubject,
  selectedNodeSubject,
  useLocationAction,
  locationActionSubject,
  iframeWindowsSubject
} from '../../../config/const'
import { addModules } from '../../utils/externals-modules'
import { useSharedMap, useSharedUpdateMap, SharedProvider, useShared, useSharedProvider } from '@rcp/use.shared'
import { Resizable } from 're-resizable'

const cn = p('')
const c = p(`${CLS_PREFIX}-stage`)

import './style.scss'

import { headerStatusSubject, useHeaderStatus } from '../header'
import { register, addRemoteGlobalThis, removeRemoteGlobalThis, setId } from '../../../../shared/pipe'
import LocationWidget from '../location-widget'
import ResizeWidget, { defaultValue } from '../resize-widget'
import { symbol } from '../../utils/utils'
import usePersistFn from '@rcp/use.persistfn'
import ResizeHandler from '../resize-handler'

setId(`main`)

export interface StageProps {
  className?: string
  bundlerURL?: string
  externalModules?: Record<string, any>
}

const DndManager = React.lazy(() => import('../../../render-floating').then((x) => ({ default: x.DndLayoutManager })))

const _ResizeContainerAs = React.forwardRef(({ isMobileMode, ...props }: any, ref) => {
  return (
    <div ref={ref} {...props} style={isMobileMode ? props.style : {}}>
      {props.children}
    </div>
  )
})
const ResizeContainer = React.memo(({ children, isMobileMode, resizeValues, setResizeValues }: any) => {
  return (
    <Resizable
      // @ts-ignore
      isMobileMode={isMobileMode}
      as={_ResizeContainerAs}
      enable={
        !isMobileMode || resizeValues.type !== 'custom'
          ? {}
          : {
              top: false,
              right: true,
              bottom: true,
              left: true,
              topRight: false,
              bottomRight: true,
              bottomLeft: false,
              topLeft: false
            }
      }
      handleWrapperStyle={{ zIndex: 300 }}
      handleStyles={{
        right: {
          width: 'auto',
          right: 0,
          transform: 'translateX(100%)'
        },
        left: {
          width: 'auto',
          left: 0,
          transform: 'translateX(-100%)'
        },
        bottom: {
          height: 'auto',
          bottom: 0,
          transform: 'translateY(100%)'
        },
        bottomRight: {
          right: 0,
          bottom: 0,
          transform: 'translate(100%, 100%)'
        }
      }}
      handleComponent={{
        right: <ResizeHandler right />,
        bottom: <ResizeHandler bottom />,
        left: <ResizeHandler left />,
        bottomRight: <ResizeHandler bottomRight />
      }}
      resizeRatio={2}
      minHeight={100}
      minWidth={100}
      className={c('__iframe-wrapper')}
      size={{
        width: resizeValues.width,
        height: resizeValues.height
      }}
      onResizeStop={(evt, direction, elem, delta) => {
        setResizeValues({
          ...resizeValues,
          width: resizeValues.width + delta.width,
          height: resizeValues.height + delta.height
        })
      }}
      style={{
        transform: resizeValues.rate ? `scale(${resizeValues.rate})` : '',
        transformOrigin: `50% 0`
      }}
    >
      {children}
    </Resizable>
  )
})

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

  const [{ isMobileMode, showLocation }] = useHeaderStatus()
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

  const [resizeValues, setResizeValues] = useLocalStorageStateSync(symbol('resize-widget'), defaultValue)
  const paddingSize = 20
  const [playground, setPlayground] = React.useState<HTMLDivElement>(null)
  const getSize = usePersistFn((playground) => {
    return {
      height: playground.clientHeight - paddingSize * 2,
      width: playground.clientWidth - paddingSize * 2
    }
  })

  return (
    <div className={cn(c(), className)}>
      {!!showLocation && <LocationWidget iframeRef={iframeRef} />}
      {!!isMobileMode && (
        <ResizeWidget
          container={playground}
          getContainerSize={getSize}
          value={resizeValues}
          onChange={setResizeValues as any}
        />
      )}
      <div
        ref={(dom) => {
          setPlayground(dom)
        }}
        style={{
          backgroundColor: '#e2e5ec',
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          padding: paddingSize,
          height: 0,
          overflow: 'auto'
        }}
      >
        <ResizeContainer isMobileMode={isMobileMode} resizeValues={resizeValues} setResizeValues={setResizeValues}>
          <div className={c('__iframe-mask')}>
            <Spin style={{ flex: 1 }} tip={'渲染中...'} />
          </div>
          <iframe ref={iframeRef} src={iframeSrc} className={c('__iframe')} />
          <div className={c('__iframe-floating-container')}>
            <DndManager />
          </div>
        </ResizeContainer>
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
