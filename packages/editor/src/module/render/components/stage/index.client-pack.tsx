import React from 'react'
import p from 'prefix-classname'
import { useDragDropManager } from 'react-dnd'
import {
  CLS_PREFIX,
  useOveringNode,
  useSelectedNode,
  overingNodeSubject,
  selectedNodeSubject
} from '../../../config/const'
import { addModules } from '../../utils/externals-modules'
// @ts-ignore
import createApi, { useFiles } from './client-pack-api'
import { useSharedMap, useSharedUpdateMap, SharedProvider, useShared, useSharedProvider } from '@rcp/use.shared'

const Dnd = require('react-dnd')

const cn = p('')
const c = p(`${CLS_PREFIX}-stage`)

import './style.scss'

import { SandpackProvider, SandpackLayout, SandpackPreview, useSandpack } from '@codesandbox/sandpack-react'
import { headerStatusSubject, useHeaderStatus } from '../header'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'

const CustomSandpack = ({}) => {
  return (
    <div className={c('__sandpack')}>
      <SandpackLayout>
        {/*<SandpackCodeEditor showLineNumbers showInlineErrors />*/}
        <SandpackPreview showNavigator viewportOrientation={'landscape'} />
      </SandpackLayout>
    </div>
  )
}

export interface StageProps {
  className?: string
  bundlerURL?: string
  externalModules?: Record<string, any>
}

const DEFAULT_CUSTOM_SETUP = {
  files: {
    '/App.tsx': {
      code: `
import React, { StrictMode } from "react";
import Tabs from "antd/es/tabs";
import "antd/es/tabs/style/index.css";

type Props = {
  x: string
}

const array = new Array(100).fill(1)

export default function App(props: Props) {

  return (
    <div>
      <h1 title={'abc'}>Hello World</h1>
      <Tabs>
      <Tabs.TabPane key={'tool'} tab={'物料'}>
        <p className='empty'></p>
        <p>单独 p</p>
        {array.map((x, i) => <p key={i}>物料__{i}</p>)}
      </Tabs.TabPane>
      <Tabs.TabPane key={'attr'} tab={'属性'}></Tabs.TabPane>
      </Tabs>
    </div>
  )
}
`
    },
    '/index.tsx': {
      code: `import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import "./styles.css";

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement
);`
    },
    '/styles.css': {
      code: `body {
  font-family: sans-serif;
  -webkit-font-smoothing: auto;
  -moz-font-smoothing: auto;
  -moz-osx-font-smoothing: grayscale;
  font-smoothing: auto;
  text-rendering: optimizeLegibility;
  font-smooth: always;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

h1 {
  font-size: 1.5rem;
}`
    },
    '/public/index.html': {
      code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`
    }
  },
  dependencies: {
    react: '^17.0.0',
    'react-dom': '^17.0.0',
    'react-scripts': '^4.0.0',
    antd: '^4.17.0'
  },
  entry: '/index.tsx',
  // main: '/App.tsx',
  environment: 'create-react-app-typescript'
}

const StageContent: React.FC<StageProps> = React.memo(({ className, externalModules }) => {
  React.useLayoutEffect(() => !!externalModules && addModules(externalModules), [externalModules])

  const { sandpack } = useSandpack()
  const ddManager = useDragDropManager()
  const _sharedMap = useSharedMap()
  const _sharedUpdateMap = useSharedUpdateMap()
  React.useLayoutEffect(
    () =>
      addModules({
        '@@__mometa-external/shared': {
          get api() {
            // lazy get, 依赖 iframe 中的数据
            return createApi(sandpack)
          },

          // value shared
          useShared,
          overingNodeSubject,
          selectedNodeSubject,
          useOveringNode,
          useSelectedNode,
          useHeaderStatus,
          headerStatusSubject,
          RootProvider: (props) => {
            return (
              <SharedProvider _internal={{ valuesMap: _sharedMap, updateMap: _sharedUpdateMap }}>
                <ConfigProvider locale={zhCN}>
                  <Dnd.DndProvider {...props} manager={ddManager} />
                </ConfigProvider>
              </SharedProvider>
            )
          }
        }
      }),
    [ddManager, _sharedMap, _sharedUpdateMap, sandpack]
  )

  return (
    <div className={cn(c(), className)}>
      <CustomSandpack />
    </div>
  )
})

const Stage = (props) => {
  const [_customSetup] = useSharedProvider(DEFAULT_CUSTOM_SETUP, { key: 'stage.customSetup' })
  const files = useFiles(_customSetup?.files)
  const customSetup = React.useMemo(() => ({ ..._customSetup, files }), [files, _customSetup])

  return (
    !!_customSetup && (
      <SandpackProvider bundlerURL={props.bundlerURL} customSetup={customSetup as any}>
        <StageContent {...props} />
      </SandpackProvider>
    )
  )
}

Stage.defaultProps = {
  bundlerURL: location.origin + '/bundler.html'
}

export default Stage
