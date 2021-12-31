import { isInIframe } from '../../shared/utils'
import { getSharedFromMain, useHeaderStatus } from '../utils/get-from-main'

export default function EmptyPlaceholder({ __mometa }) {
  const React = require('react')
  if (!React || !isInIframe()) {
    return null
  }

  const [{ canSelect }] = useHeaderStatus()

  return React.createElement(
    'mometa-empty-placeholder',
    {
      style: {
        color: '#a1a0a0',
        fontStyle: 'italic',
        width: '100%',
        ...(canSelect
          ? {
              display: 'block'
            }
          : {
              display: 'none'
            })
      }
    },
    '空视图元素'
  )
}
