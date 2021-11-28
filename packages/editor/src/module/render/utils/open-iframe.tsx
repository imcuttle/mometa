import openReactStandalone from '@rcp/util.open'
import Iframe, { IframeProps, IframeRef } from '../components/iframe'
import React from 'react'
import assignRef from 'assign-ref'

export interface OpenIframeCtx {
  iframe: IframeRef
  close: () => void
}

export function openIframe(props: IframeProps): Promise<OpenIframeCtx> {
  const ref = React.createRef<IframeRef>()
  return new Promise((resolve, reject) => {
    const ctx = openReactStandalone(() => (
      <Iframe
        ref={(r) => {
          assignRef(ref, r)
          resolve({
            get iframe() {
              return ref.current
            },
            close: ctx.close.bind(ctx)
          })
        }}
        {...props}
        onError={reject}
      />
    ))
  })
}
