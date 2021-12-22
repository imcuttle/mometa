import { AlertProps } from '../../antd/alert'
import * as React from 'react'

const Alert: React.FC<AlertProps & { myClass?: string; ids: any[] }> = React.memo(({}) => {
  return null
})

Alert.defaultProps = {
  myClass: 'abc',
  ids: ['1', '2', 3]
}

export default Alert
