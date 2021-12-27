import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { Routes, Route, Outlet, Link } from 'react-router-dom'

import './styles.css'

import App from './App'
import ListPage from './ListPage'

const Navigation = () => {
  return (
    <ul>
      <li>
        <Link to={'/list'}>ListPage</Link>
      </li>
      <li>
        <Link to={'/'}>App</Link>
      </li>
    </ul>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(
  <StrictMode>
    <HashRouter>
      <Navigation />
      <Routes>
        <Route path={'/'} element={<App />} />
        <Route path={'/list'} element={<ListPage />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
  rootElement
)
