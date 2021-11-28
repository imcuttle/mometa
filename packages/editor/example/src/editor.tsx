import React from 'react'
import ReactDOM from 'react-dom'
import { Editor } from '@mometa/editor/editor'

function App() {
  return <Editor />
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
