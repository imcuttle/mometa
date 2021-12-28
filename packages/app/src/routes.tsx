import HomePage from './pages/home'
import DetailPage from './pages/detail'
import { RouteConfig } from './render-router'
import App from './pages/app'
import Layout from './layout'
import EditPage from './pages/edit'
import { Detail } from './component/detail'

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
        path: '/detail/:id',
        component: DetailPage
      },
      {
        path: '/edit/:id',
        component: EditPage
      },
      {
        path: '/new',
        component: () => {
          return <Detail />
        }
      },
      {
        name: 'App',
        path: '/app',
        component: App
      }
    ]
  }
]
