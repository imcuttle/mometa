import HomePage from './pages/home'
import DetailPage from './pages/detail'
import { RouteConfig } from './render-router'
import App from './pages/app'
import Layout from './layout'

export const routes: RouteConfig[] = [
  {
    path: '',
    component: Layout,
    routes: [
      {
        name: 'Home',
        path: '/',
        component: HomePage
      },
      {
        name: 'Detail',
        path: '/detail',
        component: DetailPage
      },
      {
        name: 'App',
        path: '/app',
        component: App
      }
    ]
  }
]
