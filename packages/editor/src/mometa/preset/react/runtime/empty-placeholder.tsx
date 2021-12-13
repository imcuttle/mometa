export default function ({ __mometa }) {
  const React = require('@@__mometa-external/react')
  if (!React) {
    return null
  }

  return React.createElement('mometa-empty-placeholder', { __mometa })
}
