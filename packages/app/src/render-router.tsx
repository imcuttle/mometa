import type { ComponentType } from 'react'
import { Switch, Route, RouteProps, RouterProps } from 'react-router'

export interface RouteConfig {
  path?: string
  exact?: RouteProps['exact']
  key?: any
  name?: any
  strict?: RouteProps['strict']
  component?: ComponentType<RouterComponentProps>
  routes?: RouteConfig[]
}

export interface RouterComponentProps extends RouterProps {
  route: RouteConfig
}

export function RouterRender({ route }: { route: RouteConfig | RouteConfig[] }) {
  if (Array.isArray(route)) {
    // eslint-disable-next-line no-param-reassign
    route = {
      path: '',
      routes: route
    } as RouteConfig
  }

  return route?.routes ? (
    <Switch>
      {/*// @ts-ignore*/}
      {route.routes
        .concat({
          component: () => 'Not Found' as any,
          path: '**'
        })
        .map((childRoute, i) => {
          const childPath = childRoute.path as string
          if (childPath == null) {
            return null
          }
          return (
            <Route
              key={childRoute.key || i}
              path={childPath}
              exact={childRoute.exact ?? true}
              strict={childRoute.strict}
              render={(props: any) => {
                if (childRoute.component) {
                  return (
                    // eslint-disable-next-line react/jsx-pascal-case
                    <childRoute.component {...props} route={childRoute} />
                  )
                }

                return null
              }}
            />
          )
        })
        .filter(Boolean)}
    </Switch>
  ) : null
}
