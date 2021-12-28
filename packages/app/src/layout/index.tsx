import React, { Suspense } from 'react'
import { Menu, Layout as AntLayout, Spin } from 'antd'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { RouteConfig, RouterComponentProps, RouterRender } from '../render-router'

const { Header, Content } = AntLayout

export default function Layout({ route }: RouterComponentProps) {
  const loc = useLocation()
  const menu = React.useMemo(() => {
    if (route.routes) {
      const renderMenuNode = (node: RouteConfig, i: number) => {
        return (
          <Menu.Item key={node.key ?? node.path ?? i}>
            <NavLink to={node.path as any}>{node.name}</NavLink>
          </Menu.Item>
        )
      }
      return (
        <Menu selectedKeys={[loc.pathname]} theme="dark" mode="horizontal">
          {route.routes.map(renderMenuNode)}
        </Menu>
      )
    }
    return null
  }, [loc, route])

  return (
    <AntLayout style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header>{menu}</Header>
      <Content style={{ flex: 1, padding: '10px 50px' }}>
        <Suspense fallback={<Spin style={{ display: 'block', marginTop: 20, width: '100%' }} />}>
          <RouterRender route={route} />
        </Suspense>
      </Content>
    </AntLayout>
  )
}
