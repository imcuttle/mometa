import React from 'react'
import ReactDOM from 'react-dom'
import { Editor } from '@mometa/editor/editor'
import { ConfigProvider } from 'antd'

function App() {
  // @ts-ignore
  const config = global.__mometa_editor_config__
  return <Editor {...config} />
}

ConfigProvider.config({
  prefixCls: 'mmt-ant'
})

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
