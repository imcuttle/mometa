import React from 'react'
import ReactDOM from 'react-dom'
import { Editor } from '@mometa/editor/editor'

function App() {
  // @ts-ignore
  const config = global.__mometa_editor_config__
  return <Editor {...config} />
}

ReactDOM.render(<App />, document.getElementById('root'))
