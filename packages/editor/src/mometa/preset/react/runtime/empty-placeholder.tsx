export default function ({ __mometa }) {
  const React = require('@@__mometa-external/react')
  const { useHeaderStatus } = require('@@__mometa-external/shared')

  const [{ canSelect }] = useHeaderStatus()
  if (!React) {
    return null
  }

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
