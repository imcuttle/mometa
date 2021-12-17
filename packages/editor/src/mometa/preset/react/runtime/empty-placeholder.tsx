export default function EmptyPlaceholder({ __mometa }) {
  const React = require('@@__mometa-external/react')
  if (!React || !require('@@__mometa-external/shared')) {
    return null
  }

  const { useHeaderStatus } = require('@@__mometa-external/shared')
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
